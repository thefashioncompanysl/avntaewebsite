import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BarChart3, Briefcase, CheckCircle2, Clock3, Edit2, FileText, ImagePlus, LayoutDashboard, LogOut, Menu, Plus, Settings, Trash2, UserCircle, Users, X } from 'lucide-react';
import { Designer, DesignerCategory } from '../types';
import { useDesigners } from '../context/DesignersContext';
import { Avatar, Badge, Button, Checkbox, Dialog, ImageCropper, Input, Select, Tooltip } from './ui';
import LoginCard from './LoginCard';
import { supabase } from '../lib/supabaseClient';

const PROFILE_PICTURES_BUCKET = 'portraits';
const ADMIN_SETTINGS_KEY = 'avntae:admin-settings';
const ADMIN_SESSION_TIMEOUT_MS = 10 * 60 * 1000;

type AdminView = 'designers' | 'analytics' | 'settings';

type NoticeTone = 'success' | 'error' | 'info';

type Notice = {
    id: number;
    tone: NoticeTone;
    title: string;
    message: string;
};

type ConfirmAction =
    | { kind: 'bulk-delete'; count: number }
    | { kind: 'bulk-approve'; count: number }
    | { kind: 'delete-designer'; id: string; name: string }
    | null;

type AdminSettings = {
    defaultApproved: 'true' | 'false';
    pageSize: number;
    sessionTimeoutMinutes: number;
    requireDeleteConfirmation: boolean;
    compactTable: boolean;
    analyticsDefaultRange: '7d' | '30d' | '90d' | '365d' | 'all';
    analyticsDefaultMetric: 'approval' | 'new' | 'images' | 'pending';
};

const defaultSettings: AdminSettings = {
    defaultApproved: 'true',
    pageSize: 10,
    sessionTimeoutMinutes: 10,
    requireDeleteConfirmation: true,
    compactTable: false,
    analyticsDefaultRange: '30d',
    analyticsDefaultMetric: 'approval',
};

const analyticsMetricLabels: Record<AdminSettings['analyticsDefaultMetric'], string> = {
    approval: 'Approval rate',
    new: 'New profiles',
    images: 'Profiles with portraits',
    pending: 'Pending review',
};

const analyticsRangeLabels: Record<AdminSettings['analyticsDefaultRange'], string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '365d': 'Last 12 months',
    all: 'All time',
};

const loadSettings = (): AdminSettings => {
    try {
        const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
        if (!raw) return defaultSettings;

        const parsed = JSON.parse(raw) as Partial<AdminSettings>;

        const resolvedRange = ['7d', '30d', '90d', '365d', 'all'].includes(String(parsed.analyticsDefaultRange))
            ? (parsed.analyticsDefaultRange as AdminSettings['analyticsDefaultRange'])
            : defaultSettings.analyticsDefaultRange;
        const resolvedMetric = ['approval', 'new', 'images', 'pending'].includes(String(parsed.analyticsDefaultMetric))
            ? (parsed.analyticsDefaultMetric as AdminSettings['analyticsDefaultMetric'])
            : defaultSettings.analyticsDefaultMetric;

        return {
            defaultApproved: parsed.defaultApproved === 'false' ? 'false' : 'true',
            pageSize: [5, 10, 20].includes(Number(parsed.pageSize)) ? Number(parsed.pageSize) : 10,
            sessionTimeoutMinutes: 10,
            requireDeleteConfirmation: parsed.requireDeleteConfirmation !== false,
            compactTable: parsed.compactTable === true,
            analyticsDefaultRange: resolvedRange,
            analyticsDefaultMetric: resolvedMetric,
        };
    } catch {
        return defaultSettings;
    }
};

export default function AdminDashboard() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeView, setActiveView] = useState<AdminView>('designers');
    const [settings, setSettings] = useState<AdminSettings>(loadSettings());

    const {
        designers,
        addDesigner,
        createDesignerRecord,
        updateDesigner,
        deleteDesigner,
        toggleApproval,
        updateCategory,
        bulkDelete,
        bulkUpdate,
        refreshDesigners,
    } = useDesigners();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | string>('All');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(settings.pageSize);
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Designer>>({});
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const noticeIdRef = useRef(1);
    const adminTimeoutRef = useRef<number | null>(null);

    const pushNotice = (tone: NoticeTone, title: string, message: string) => {
        const id = noticeIdRef.current++;
        setNotices((current) => [...current, { id, tone, title, message }]);
        window.setTimeout(() => {
            setNotices((current) => current.filter((notice) => notice.id !== id));
        }, 3600);
    };

    const closeNotice = (id: number) => {
        setNotices((current) => current.filter((notice) => notice.id !== id));
    };

    const clearAdminTimeout = () => {
        if (adminTimeoutRef.current !== null) {
            window.clearTimeout(adminTimeoutRef.current);
            adminTimeoutRef.current = null;
        }
    };

    const signOutAdmin = async (title: string, message: string, tone: NoticeTone = 'info') => {
        clearAdminTimeout();
        await supabase.auth.signOut();
        setSession(null);
        setEmail('');
        setPassword('');
        pushNotice(tone, title, message);
    };

    const validateAdminSession = async (candidateSession: any) => {
        const candidateEmail = String(candidateSession?.user?.email || '').trim().toLowerCase();

        if (!candidateSession || !candidateEmail) {
            setSession(candidateSession);
            return;
        }

        const { data, error } = await supabase
            .from('admins')
            .select('email')
            .eq('email', candidateEmail)
            .maybeSingle();

        if (error || !data) {
            await signOutAdmin('Access denied', 'This account is not authorized for the admin panel.', 'error');
            return;
        }

        setSession(candidateSession);
    };

    useEffect(() => {
        setPageSize(settings.pageSize);
    }, [settings.pageSize]);

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (!active) return;
            await validateAdminSession(currentSession);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            void validateAdminSession(currentSession);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
            clearAdminTimeout();
        };
    }, []);

    useEffect(() => {
        if (!session?.user?.email) {
            clearAdminTimeout();
            return;
        }

        const resetTimeout = () => {
            clearAdminTimeout();
            adminTimeoutRef.current = window.setTimeout(() => {
                void signOutAdmin('Session expired', 'You were logged out after 10 minutes of inactivity.');
            }, ADMIN_SESSION_TIMEOUT_MS);
        };

        const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        const handleActivity = () => {
            resetTimeout();
        };

        resetTimeout();
        events.forEach((event) => window.addEventListener(event, handleActivity));

        return () => {
            clearAdminTimeout();
            events.forEach((event) => window.removeEventListener(event, handleActivity));
        };
    }, [session?.user?.email]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            pushNotice('error', 'Login failed', (error as any).message || 'Check your credentials and try again.');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setEmail('');
        setPassword('');
    };

    const filtered = useMemo(() => {
        return designers.filter((designer) => {
            const matchesSearch = designer.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategoryFilter === 'All' || designer.category === selectedCategoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [designers, searchQuery, selectedCategoryFilter]);

    const analytics = useMemo(() => {
        const total = designers.length;
        const approved = designers.filter((designer) => designer.approved !== false).length;
        const pending = total - approved;
        const portraits = designers.filter((designer) => Boolean(designer.image)).length;

        const categoryCounts = designers.reduce<Record<string, number>>((accumulator, designer) => {
            accumulator[designer.category] = (accumulator[designer.category] || 0) + 1;
            return accumulator;
        }, {});

        const createdDates = designers
            .map((designer) => (designer.createdAt ? new Date(designer.createdAt) : null))
            .filter((date): date is Date => Boolean(date) && !Number.isNaN(date.getTime()));

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - 7);
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);

        const newThisMonth = createdDates.filter((date) => date >= monthStart).length;
        const newThisWeek = createdDates.filter((date) => date >= weekStart).length;
        const newThisMonthThirtyDayWindow = createdDates.filter((date) => date >= monthAgo).length;
        const imageCoverage = total > 0 ? Math.round((portraits / total) * 100) : 0;
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

        const latestProfile = createdDates.length
            ? createdDates.reduce((latest, current) => (current > latest ? current : latest), createdDates[0])
            : null;

        return {
            total,
            approved,
            pending,
            portraits,
            imageCoverage,
            approvalRate,
            newThisMonth,
            newThisWeek,
            newThisMonthThirtyDayWindow,
            categoryCounts,
            latestProfile,
        };
    }, [designers]);

    const compactTableClass = settings.compactTable ? 'p-3' : 'p-4';
    const analyticsSpotlightValue = (() => {
        switch (settings.analyticsDefaultMetric) {
            case 'new':
                return analytics.newThisMonthThirtyDayWindow;
            case 'images':
                return `${analytics.imageCoverage}%`;
            case 'pending':
                return analytics.pending;
            case 'approval':
            default:
                return `${analytics.approvalRate}%`;
        }
    })();

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedDesigners = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCropSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (dataUrl: string): Promise<string | null> => {
        try {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
            const bstr = atob(arr[1]);
            const n = bstr.length;
            const u8arr = new Uint8Array(n);
            for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
            const blob = new Blob([u8arr], { type: mime });
            const fileName = `${editingId || Date.now()}.jpg`;
            const { data, error } = await supabase.storage
                .from(PROFILE_PICTURES_BUCKET)
                .upload(fileName, blob, { upsert: true });

            if (error) throw error;
            const { data: publicData } = supabase.storage.from(PROFILE_PICTURES_BUCKET).getPublicUrl(fileName);
            return publicData.publicUrl as string;
        } catch (err) {
            console.error('Image upload failed:', err);
            return null;
        }
    };

    const openForm = (designer?: Designer) => {
        if (designer) {
            setEditingId(designer.id);
            setFormData(designer);
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                specialization: '',
                bio: '',
                image: '',
                category: 'Professional',
                approved: settings.defaultApproved === 'true',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = formData.image;
            if (formData.image && formData.image.startsWith('data:')) {
                imageUrl = await uploadImage(formData.image);
                if (!imageUrl) {
                    pushNotice('error', 'Upload failed', 'The portrait could not be uploaded. Please try again.');
                    setIsUploading(false);
                    return;
                }
            }

            const data: Designer = {
                id: editingId || Date.now().toString(),
                name: formData.name || '',
                specialization: formData.specialization || '',
                bio: formData.bio || '',
                image: imageUrl || '',
                category: (formData.category || 'Professional') as DesignerCategory,
                approved: formData.approved || false,
            };

            if (editingId) {
                await updateDesigner(editingId, data);
                pushNotice('success', 'Profile updated', `${data.name} was saved successfully.`);
            } else {
                await addDesigner(data);
                pushNotice('success', 'Profile added', `${data.name} is now in the roster.`);
            }

            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
            await refreshDesigners(true);
        } catch (error) {
            console.error('Save failed:', error);
            pushNotice('error', 'Save failed', (error as any).message || 'Something went wrong while saving the profile.');
        } finally {
            setIsUploading(false);
        }
    };

    const allVisibleSelected = paginatedDesigners.length > 0 && paginatedDesigners.every((d) => selectedIds[d.id]);
    const handleSelectAllVisible = (checked: boolean) => {
        const newIds = { ...selectedIds };
        paginatedDesigners.forEach((d) => {
            newIds[d.id] = checked;
        });
        setSelectedIds(newIds);
    };

    const selectedIdList = Object.entries(selectedIds).filter(([, v]) => v).map(([k]) => k);
    const bulkApproveSelected = async () => {
        if (selectedIdList.length === 0) {
            pushNotice('info', 'Nothing selected', 'Choose one or more designers before bulk approving.');
            return;
        }
        setConfirmAction({ kind: 'bulk-approve', count: selectedIdList.length });
    };

    const runBulkApprove = async () => {
        try {
            await bulkUpdate(selectedIdList, { approved: true });
            await refreshDesigners();
            setSelectedIds({});
            pushNotice('success', 'Bulk approved', `${selectedIdList.length} designers were approved.`);
        } catch (error) {
            pushNotice('error', 'Bulk approve failed', (error as any).message || 'Could not approve the selected designers.');
        }
    };

    const bulkDeleteSelected = async () => {
        if (selectedIdList.length === 0) {
            pushNotice('info', 'Nothing selected', 'Choose one or more designers before bulk deleting.');
            return;
        }
        if (settings.requireDeleteConfirmation) {
            setConfirmAction({ kind: 'bulk-delete', count: selectedIdList.length });
            return;
        }
        await runBulkDelete();
    };

    const runBulkDelete = async () => {
        try {
            await bulkDelete(selectedIdList);
            await refreshDesigners();
            setSelectedIds({});
            pushNotice('success', 'Bulk deleted', `${selectedIdList.length} designers were removed.`);
        } catch (error) {
            pushNotice('error', 'Bulk delete failed', (error as any).message || 'Could not delete the selected designers.');
        }
    };

    const escapeCSV = (value: any): string => {
        if (value === undefined || value === null) return '';
        return `"${String(value).replace(/"/g, '""')}"`;
    };

    const exportCSV = (data: Designer[]) => {
        const headers = ['Name', 'Specialization', 'Category', 'Status'];
        const rows = data.map((d) => [d.name, d.specialization, d.category, d.approved ? 'Approved' : 'Pending']);
        const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCSV).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'designers.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const parseCSV = (text: string) => {
        const lines = text.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map((h) => h.toLowerCase().trim());
        const output: Record<string, string>[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));

            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            output.push(row);
        }
        return output;
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
                <div className="max-w-md w-full flex items-center justify-center">
                    <LoginCard
                        email={email}
                        password={password}
                        onEmailChange={(v) => setEmail(v)}
                        onPasswordChange={(v) => setPassword(v)}
                        onLogin={handleLogin}
                        onRegister={() => pushNotice('info', 'Registration disabled', 'Use an approved admin account to sign in.')} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -180 }}
                animate={{
                    x: 0,
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className={`glass border-r border-[var(--border-primary)] flex flex-col z-50 flex-shrink-0 fixed inset-y-0 left-0 w-72 transition-transform duration-200 ease-out will-change-opt lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="p-4 lg:p-6 border-b border-[var(--border-primary)]">
                    <h1 className="text-xl font-serif text-luxury-accent">AVNTAE Admin</h1>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-2">
                    {[
                        { id: 'designers', icon: Users, label: 'Designers' },
                        { id: 'analytics', icon: LayoutDashboard, label: 'Analytics' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setActiveView(id as AdminView);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${activeView === id ? 'bg-luxury-accent text-[var(--bg-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10'}`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 lg:p-6 border-t border-[var(--border-primary)]">
                    <Button variant="outline" onClick={handleLogout} className="w-full justify-center gap-2">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </motion.aside>

            {/* Main content */}
            <main className="min-w-0 flex min-h-screen flex-col">
                <header className="sticky top-0 z-30 glass border-b border-[var(--border-primary)] px-4 lg:px-10 py-4 lg:py-5 flex justify-between items-center backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-[var(--text-primary)]/10 transition-colors"
                            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-serif leading-tight">Admin Panel</h2>
                            <p className="text-xs uppercase tracking-[0.35em] opacity-45 mt-1">Designers, analytics, and settings</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 xl:p-10 space-y-8">
                    {activeView === 'designers' && (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    { label: 'Total profiles', value: designers.length, icon: Users },
                                    { label: 'Approved', value: analytics.approved, icon: CheckCircle2 },
                                    { label: 'Pending', value: analytics.pending, icon: Clock3 },
                                ].map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div key={card.label} className="glass rounded-3xl border border-[var(--border-primary)] p-5 shadow-xl">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 font-bold mb-2">{card.label}</p>
                                                    <div className="text-3xl font-serif">{card.value}</div>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-luxury-accent/10 text-luxury-accent">
                                                    <Icon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="text-xl lg:text-2xl font-serif">Active Profiles</h3>
                                    <p className="text-sm opacity-60 mt-1">Search, review, and update designer records.</p>
                                </div>

                                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
                                    <div className="flex flex-col sm:flex-row gap-3 min-w-0">
                                        <Input
                                            placeholder="Search designers..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full sm:max-w-sm"
                                        />
                                        <Select
                                            value={selectedCategoryFilter}
                                            onChange={(e) => {
                                                setSelectedCategoryFilter(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full sm:max-w-xs"
                                        >
                                            <option value="All">All Categories</option>
                                            <option value="Student">Student</option>
                                            <option value="Intern">Intern</option>
                                            <option value="Professional">Professional</option>
                                        </Select>
                                    </div>

                                    <div className="flex flex-wrap gap-2 lg:gap-3 w-full xl:w-auto">
                                    <Button variant="default" onClick={() => openForm()} className="flex items-center gap-2 flex-1 lg:flex-none justify-center">
                                        <Plus size={16} /> Add Designer
                                    </Button>
                                    <Button variant="ghost" onClick={() => exportCSV(designers)} className="flex-1 lg:flex-none">Export CSV</Button>
                                    <Button variant="outline" onClick={bulkApproveSelected} className="flex-1 lg:flex-none">Bulk Approve</Button>
                                    <Button variant="outline" onClick={bulkDeleteSelected} className="flex-1 lg:flex-none">Bulk Delete</Button>
                                    </div>
                                </div>
                            </div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.35 }} className="glass bg-[var(--text-primary)]/4 rounded-3xl border border-[var(--border-primary)] overflow-hidden shadow-2xl will-change-opt">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[840px]">
                                        <thead>
                                            <tr className="border-b border-[var(--border-primary)] bg-[var(--text-primary)]/5">
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60 w-12`}>
                                                    <input type="checkbox" checked={allVisibleSelected} onChange={(e) => handleSelectAllVisible(e.target.checked)} />
                                                </th>
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60`}>Name</th>
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60`}>Specialization</th>
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60`}>Category</th>
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60`}>Status</th>
                                                <th className={`${compactTableClass} text-xs font-bold uppercase tracking-wider opacity-60`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedDesigners.map((designer) => (
                                                <motion.tr key={designer.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--text-primary)]/5 transition-colors">
                                                    <td className={compactTableClass}>
                                                        <Checkbox
                                                            checked={selectedIds[designer.id] || false}
                                                            onChange={(e) => setSelectedIds({ ...selectedIds, [designer.id]: e.target.checked })}
                                                        />
                                                    </td>
                                                    <td className={`${compactTableClass} flex items-center gap-3`}>
                                                        {designer.image && <Avatar src={designer.image} alt={designer.name} />}
                                                        <span className="font-medium truncate">{designer.name}</span>
                                                    </td>
                                                    <td className={`${compactTableClass} text-sm opacity-70 max-w-xs truncate`}>{designer.specialization}</td>
                                                    <td className={`${compactTableClass} text-sm`}>{designer.category}</td>
                                                    <td className={compactTableClass}>
                                                        <button onClick={() => toggleApproval(designer.id, designer.approved)} className="transition-all">
                                                            <Badge className={designer.approved ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}>
                                                                {designer.approved ? 'Approved' : 'Pending'}
                                                            </Badge>
                                                        </button>
                                                    </td>
                                                    <td className={`${compactTableClass} text-right`}>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Tooltip content={`Edit ${designer.name}`}>
                                                                <button
                                                                    onClick={() => openForm(designer)}
                                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-primary)] text-[var(--text-primary)] transition-all hover:-translate-y-0.5 hover:border-luxury-accent hover:backdrop-blur-sm hover:bg-[rgba(255,255,255,0.02)]"
                                                                    aria-label={`Edit ${designer.name}`}
                                                                >
                                                                    <Edit2 size={15} />
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip content={`Delete ${designer.name}`}>
                                                                <button
                                                                    onClick={() => {
                                                                        if (settings.requireDeleteConfirmation) {
                                                                            setConfirmAction({ kind: 'delete-designer', id: designer.id, name: designer.name });
                                                                        } else {
                                                                            deleteDesigner(designer.id).then(() => pushNotice('success', 'Profile deleted', `${designer.name} was removed.`));
                                                                        }
                                                                    }}
                                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 text-red-300 transition-all hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white"
                                                                    aria-label={`Delete ${designer.name}`}
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-3 lg:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--border-primary)]">
                                    <div className="text-xs lg:text-sm opacity-60 text-center sm:text-left">Page {page} / {totalPages} — {filtered.length} results</div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-3 w-full sm:w-auto">
                                        <Select value={pageSize} onChange={(e) => { const next = Number(e.target.value); setPageSize(next); setSettings((prev) => ({ ...prev, pageSize: next })); setPage(1); }} className="max-w-[90px] w-full sm:w-auto">
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </Select>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex-1 sm:flex-none">
                                                Prev
                                            </Button>
                                            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="flex-1 sm:flex-none">
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}

                    {activeView === 'analytics' && (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.45em] opacity-50 mb-2 font-bold">Analytics</p>
                                    <h3 className="text-3xl lg:text-4xl font-serif">Performance snapshot</h3>
                                </div>
                                <div className="glass rounded-full border border-[var(--border-primary)] px-4 py-2 text-xs uppercase tracking-widest opacity-70">
                                    Default metric: {analyticsMetricLabels[settings.analyticsDefaultMetric]} · {analyticsRangeLabels[settings.analyticsDefaultRange]}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { label: 'Total profiles', value: analytics.total, icon: Users, hint: 'All stored designer records' },
                                    { label: 'Approval rate', value: `${analytics.approvalRate}%`, icon: CheckCircle2, hint: `${analytics.approved} approved / ${analytics.pending} pending` },
                                    { label: 'Profile portraits', value: `${analytics.imageCoverage}%`, icon: ImagePlus, hint: `${analytics.portraits} profiles with media` },
                                    { label: 'New this month', value: analytics.newThisMonth, icon: Clock3, hint: analytics.latestProfile ? `Latest: ${new Date(analytics.latestProfile).toLocaleDateString()}` : 'No timestamped entries yet' },
                                ].map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div key={card.label} className="glass rounded-3xl border border-[var(--border-primary)] p-5 lg:p-6 shadow-xl">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 font-bold mb-3">{card.label}</p>
                                                    <div className="text-3xl lg:text-4xl font-serif">{card.value}</div>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-luxury-accent/10 text-luxury-accent">
                                                    <Icon size={18} />
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm opacity-65">{card.hint}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                                <div className="glass rounded-3xl border border-[var(--border-primary)] p-5 lg:p-6 shadow-2xl">
                                    <div className="flex items-center justify-between gap-3 mb-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 font-bold mb-2">Distribution</p>
                                            <h4 className="text-2xl font-serif">Designer categories</h4>
                                        </div>
                                        <div className="rounded-full border border-[var(--border-primary)] px-3 py-1 text-xs uppercase tracking-widest opacity-60">
                                            {analytics.total} total
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {['Student', 'Intern', 'Professional'].map((category) => {
                                            const value = analytics.categoryCounts[category] || 0;
                                            const width = analytics.total > 0 ? Math.max(8, Math.round((value / analytics.total) * 100)) : 0;
                                            return (
                                                <div key={category}>
                                                    <div className="flex items-center justify-between text-sm mb-2">
                                                        <span>{category}</span>
                                                        <span className="opacity-60">{value}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-[var(--text-primary)]/10 overflow-hidden">
                                                        <div className="h-full rounded-full bg-luxury-accent" style={{ width: `${width}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass rounded-3xl border border-[var(--border-primary)] p-5 lg:p-6 shadow-2xl">
                                        <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 font-bold mb-2">Spotlight</p>
                                        <div className="text-4xl font-serif">{analyticsSpotlightValue}</div>
                                        <p className="mt-3 text-sm opacity-65">{analyticsMetricLabels[settings.analyticsDefaultMetric]} across {analyticsRangeLabels[settings.analyticsDefaultRange].toLowerCase()}.</p>
                                    </div>

                                    <div className="glass rounded-3xl border border-[var(--border-primary)] p-5 lg:p-6 shadow-2xl space-y-4">
                                        <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 font-bold">Operational notes</p>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="opacity-70">Profiles with portraits</span>
                                                <span>{analytics.portraits}/{analytics.total}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="opacity-70">New profiles this week</span>
                                                <span>{analytics.newThisWeek}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="opacity-70">Pending reviews</span>
                                                <span>{analytics.pending}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="glass rounded-2xl p-4 lg:p-6 border border-[var(--border-primary)] space-y-4 lg:space-y-6 max-w-2xl">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-bold">Settings</p>
                                <h3 className="text-4xl font-serif">Admin Preferences</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Default New Designer Status</label>
                                    <Select className="w-full" value={settings.defaultApproved} onChange={(e) => setSettings((prev) => ({ ...prev, defaultApproved: e.target.value as 'true' | 'false' }))}>
                                        <option value="true">Approved</option>
                                        <option value="false">Pending Review</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Table Page Size</label>
                                    <Select className="w-full" value={String(settings.pageSize)} onChange={(e) => setSettings((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Default Analytics Range</label>
                                    <Select className="w-full" value={settings.analyticsDefaultRange} onChange={(e) => setSettings((prev) => ({ ...prev, analyticsDefaultRange: e.target.value as AdminSettings['analyticsDefaultRange'] }))}>
                                        <option value="7d">Last 7 days</option>
                                        <option value="30d">Last 30 days</option>
                                        <option value="90d">Last 90 days</option>
                                        <option value="365d">Last 12 months</option>
                                        <option value="all">All time</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Default Analytics Metric</label>
                                    <Select className="w-full" value={settings.analyticsDefaultMetric} onChange={(e) => setSettings((prev) => ({ ...prev, analyticsDefaultMetric: e.target.value as AdminSettings['analyticsDefaultMetric'] }))}>
                                        <option value="approval">Approval rate</option>
                                        <option value="new">New profiles</option>
                                        <option value="images">Profiles with portraits</option>
                                        <option value="pending">Pending review</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Session Timeout</label>
                                    <div className="rounded-2xl border border-[var(--border-primary)] px-4 py-3 text-sm opacity-80">
                                        Fixed at 10 minutes of inactivity before automatic logout.
                                    </div>
                                </div>

                                <label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-primary)] px-4 py-3">
                                    <span className="text-sm">Require delete confirmation</span>
                                    <Checkbox checked={settings.requireDeleteConfirmation} onChange={(e) => setSettings((prev) => ({ ...prev, requireDeleteConfirmation: e.target.checked }))} />
                                </label>

                                <label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-primary)] px-4 py-3">
                                    <span className="text-sm">Compact table layout</span>
                                    <Checkbox checked={settings.compactTable} onChange={(e) => setSettings((prev) => ({ ...prev, compactTable: e.target.checked }))} />
                                </label>
                            </div>

                            <Button variant="default" onClick={() => { localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings)); pushNotice('success', 'Settings saved', 'Your admin preferences were updated.'); }} className="w-full">
                                Save Settings
                            </Button>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isModalOpen && (
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} title={editingId ? 'Edit Designer Profile' : 'Add New Designer'}>
                            <motion.div initial={{ scale: 0.98, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 12 }} transition={{ duration: 0.22 }} className="glass bg-[var(--text-primary)]/6 rounded-3xl p-0 max-w-2xl w-full mx-4 border border-[var(--border-primary)] shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col will-change-opt">
                                <div className="p-4 lg:p-8 overflow-y-auto">
                                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-primary)] rounded-2xl bg-[var(--text-primary)]/5 hover:border-luxury-accent/50 transition-colors group relative">
                                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {formData.image ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-luxury-accent shadow-[0_0_20px_rgba(212,175,55,0.2)]" loading="lazy" decoding="async" />
                                                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-70 group-hover:text-luxury-accent transition-colors flex items-center gap-2">
                                                        <ImagePlus size={14} /> Change Portrait
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-[var(--text-primary)] opacity-50 group-hover:opacity-100 group-hover:text-luxury-accent transition-all">
                                                    <div className="w-16 h-16 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center">
                                                        <ImagePlus size={24} />
                                                    </div>
                                                    <span className="text-xs uppercase tracking-widest font-bold">Click or drag to upload portrait</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2 font-bold"><UserCircle size={14} /> Full Name</label>
                                                <input required type="text" placeholder="e.g. Elena Vance" className="input-luxury !py-3 bg-[var(--text-primary)]/5 px-4 rounded-xl border-none focus:ring-1 focus:ring-luxury-accent w-full" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            </div>

                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2 font-bold"><Briefcase size={14} /> Specialization</label>
                                                <input required type="text" placeholder="e.g. Luxury Evening Wear" className="input-luxury !py-3 bg-[var(--text-primary)]/5 px-4 rounded-xl border-none focus:ring-1 focus:ring-luxury-accent w-full" value={formData.specialization || ''} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2 font-bold"><FileText size={14} /> Biography</label>
                                            <textarea required placeholder="Write a brief professional summary..." className="input-luxury !py-3 bg-[var(--text-primary)]/5 px-4 rounded-xl border-none focus:ring-1 focus:ring-luxury-accent min-h-[100px] resize-none w-full" value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Category Assignment</label>
                                                <select className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-3 px-4 text-sm outline-none focus:border-luxury-accent shadow-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as DesignerCategory })}>
                                                    <option value="Student">Student Initiative</option>
                                                    <option value="Intern">Intern Program</option>
                                                    <option value="Professional">Professional Roster</option>
                                                </select>
                                            </div>

                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block font-bold">Profile Status</label>
                                                <select className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-3 px-4 text-sm outline-none focus:border-luxury-accent shadow-sm" value={formData.approved ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, approved: e.target.value === 'true' })}>
                                                    <option value="true">Active / Approved</option>
                                                    <option value="false">Pending Review</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 lg:pt-6 border-t border-[var(--border-primary)] mt-2 flex flex-col sm:flex-row justify-end gap-3 lg:gap-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</Button>
                                            <Button type="submit" className="min-w-[180px]" disabled={isUploading}>{isUploading ? 'Uploading...' : (editingId ? 'Save Changes' : 'Confirm & Add')}</Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </Dialog>
                    )}
                </AnimatePresence>

                {cropSrc && (
                    <ImageCropper
                        src={cropSrc}
                        onCancel={() => setCropSrc(null)}
                        onCrop={(dataUrl) => {
                            setFormData((prev) => ({ ...prev, image: dataUrl }));
                            setCropSrc(null);
                        }}
                    />
                )}

                {isUploading && typeof document !== 'undefined' ? createPortal(
                    <div style={{ zIndex: 99999999 }} className="fixed inset-0 flex items-center justify-center bg-black/60 pointer-events-auto">
                        <div className="glass bg-[var(--text-primary)]/8 rounded-2xl p-8 border border-[var(--border-primary)] shadow-2xl flex flex-col items-center gap-4 will-change-opt">
                            <svg className="animate-spin h-10 w-10 text-luxury-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <p className="text-xl font-serif">Saving...</p>
                            <p className="text-sm opacity-60">Please wait while we save the profile.</p>
                        </div>
                    </div>,
                    document.body
                ) : null}

                <AnimatePresence>
                    {confirmAction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/55 p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                                className="w-full max-w-md rounded-3xl border border-[var(--border-primary)] bg-[var(--text-primary)]/6 backdrop-blur-xl p-6 shadow-2xl will-change-opt"
                            >
                                <p className="text-[10px] uppercase tracking-[0.45em] opacity-50 font-bold mb-3">Confirm action</p>
                                <h4 className="text-2xl font-serif mb-2">
                                    {confirmAction.kind === 'delete-designer' && `Delete ${confirmAction.name}?`}
                                    {confirmAction.kind === 'bulk-delete' && `Delete ${confirmAction.count} designers?`}
                                    {confirmAction.kind === 'bulk-approve' && `Approve ${confirmAction.count} designers?`}
                                </h4>
                                <p className="text-sm opacity-70 mb-6">
                                    {confirmAction.kind === 'delete-designer' && 'This action cannot be undone.'}
                                    {confirmAction.kind === 'bulk-delete' && 'This will permanently remove the selected profiles.'}
                                    {confirmAction.kind === 'bulk-approve' && 'This will mark the selected profiles as approved.'}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-end gap-3">
                                    <Button variant="ghost" type="button" onClick={() => setConfirmAction(null)} className="sm:flex-none">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={async () => {
                                            const action = confirmAction;
                                            setConfirmAction(null);

                                            if (!action) return;

                                            if (action.kind === 'bulk-approve') {
                                                await runBulkApprove();
                                                return;
                                            }

                                            if (action.kind === 'bulk-delete') {
                                                await runBulkDelete();
                                                return;
                                            }

                                            await deleteDesigner(action.id);
                                            await refreshDesigners();
                                            pushNotice('success', 'Profile deleted', `${action.name} was removed.`);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="fixed right-4 top-4 z-[13000] flex w-[min(92vw,24rem)] flex-col gap-3 pointer-events-none">
                    <AnimatePresence>
                        {notices.map((notice) => {
                            const toneClasses = {
                                success: 'border-green-500/30 bg-green-500/12 text-green-100',
                                error: 'border-red-500/30 bg-red-500/12 text-red-100',
                                info: 'border-[var(--border-primary)] bg-[var(--text-primary)]/10 text-[var(--text-primary)]',
                            }[notice.tone];

                            return (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                    className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${toneClasses}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.35em] opacity-70 font-bold">{notice.title}</p>
                                            <p className="mt-2 text-sm opacity-90">{notice.message}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => closeNotice(notice.id)}
                                            className="shrink-0 rounded-full border border-current/20 px-2 py-1 text-xs opacity-70 hover:opacity-100"
                                            aria-label="Dismiss notification"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
