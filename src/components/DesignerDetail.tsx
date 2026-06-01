import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Briefcase, Mail, Star as Sparkles, UserCircle } from 'lucide-react';
import { useDesigners } from '../context/DesignersContext';
import { Badge } from './ui';

export default function DesignerDetail() {
    const { designerId } = useParams();
    const { designers, loading } = useDesigners();

    const designer = designers.find((entry) => entry.id === designerId);

    if (loading) {
        return (
            <div className="min-h-screen px-6 py-28 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full border border-[var(--border-primary)] border-t-luxury-accent animate-spin mx-auto" />
                    <p className="text-sm uppercase tracking-[0.3em] opacity-50">Loading designer profile</p>
                </div>
            </div>
        );
    }

    if (!designer) {
        return (
            <div className="min-h-screen px-6 py-28 flex items-center justify-center">
                <div className="max-w-lg text-center space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.4em] opacity-50">Profile not found</p>
                    <h1 className="text-4xl md:text-6xl font-serif">This designer is unavailable.</h1>
                    <p className="opacity-60 leading-relaxed">
                        The profile may have been removed or is still syncing from Supabase.
                    </p>
                    <Link to="/portfolio" className="inline-flex items-center gap-3 rounded-full border border-[var(--border-primary)] px-6 py-3 hover:border-luxury-accent transition-colors">
                        <ArrowLeft size={16} />
                        Back to portfolio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-20 md:py-28">
            <div className="max-w-7xl mx-auto">
                    <Link to="/portfolio" className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity mb-10">
                    <ArrowLeft size={16} /> Back to portfolio
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"
                >
                    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-primary)] bg-[var(--text-primary)]/5 shadow-2xl">
                        <img
                            src={designer.image || 'https://via.placeholder.com/900x1200'}
                            alt={designer.name}
                            className="w-full h-full object-cover min-h-[540px]"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = 'https://via.placeholder.com/900x1200?text=Designer+Image';
                            }}
                        />
                        <div className="designer-image-overlay absolute inset-x-0 bottom-0 p-6">
                            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-primary)]/70 mb-2">Portfolio Preview</p>
                            <h2 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)]">{designer.name}</h2>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 mb-4">Designer Profile</p>
                            <h1 className="text-5xl md:text-7xl font-serif leading-none">{designer.name}</h1>
                            <p className="mt-4 text-luxury-accent uppercase tracking-[0.25em] text-sm font-bold">
                                {designer.specialization}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="glass rounded-2xl border border-[var(--border-primary)] p-5 bg-[var(--text-primary)]/5">
                                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] opacity-50 mb-3">
                                    <UserCircle size={16} /> Category
                                </div>
                                <Badge className="text-lg font-serif bg-[var(--text-primary)]/8 text-[var(--text-primary)] border-[var(--border-primary)] py-3 px-4 backdrop-blur-md">
                                    {designer.category}
                                </Badge>
                            </div>
                            <div className="glass rounded-2xl border border-[var(--border-primary)] p-5 bg-[var(--text-primary)]/5">
                                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] opacity-50 mb-3">
                                    <Sparkles size={16} /> Status
                                </div>
                                <Badge className={`text-lg font-serif py-3 px-4 ${designer.approved ? 'bg-luxury-accent/10 text-luxury-accent border-luxury-accent/20' : 'bg-[var(--text-primary)]/8 text-[var(--text-primary)] border-[var(--border-primary)] backdrop-blur-md'}`}>
                                    {designer.approved ? 'Approved' : 'Pending Review'}
                                </Badge>
                            </div>
                        </div>

                        <div className="glass rounded-[1.5rem] border border-[var(--border-primary)] bg-[var(--text-primary)]/4 p-6 md:p-8 space-y-5">
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] opacity-50">
                                <Briefcase size={16} /> About
                            </div>
                            <p className="text-lg leading-relaxed opacity-80">{designer.bio}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/contact"
                                state={{ message: `I'm interested in collaborating with ${designer.name} (${designer.specialization}).` }}
                                className="inline-flex items-center gap-3 rounded-full border border-[var(--border-primary)] px-6 py-3 font-bold uppercase tracking-[0.25em] text-[10px] hover:border-luxury-accent transition-colors"
                            >
                                Contact AVNTAE
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}