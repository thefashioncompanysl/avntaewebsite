import { Button } from './Button';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Input, Label, Textarea } from './Input';
import { Reveal } from './Reveal';
import ImageCropper from './ImageCropper';
import { Select } from './Select';
import { Checkbox } from './Checkbox';

export { Button } from './Button';
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export { Input, Label, Textarea } from './Input';
export { Reveal } from './Reveal';
export { default as ImageCropper } from './ImageCropper';
export { Select } from './Select';
export { Checkbox } from './Checkbox';

// Shadcn-style named exports (aliases) — point to existing local components
export const AspectRatio = undefined as any;
export { Avatar } from './Avatar';
export { Badge } from './Badge';
export { Dialog } from './Dialog';
export const Drawer = undefined as any;
export const DropdownMenu = undefined as any;
export const Popover = undefined as any;
export const Progress = undefined as any;
export const RadioGroup = undefined as any;
export const ScrollArea = undefined as any;
export const Table = undefined as any;
export const Tabs = undefined as any;
export const TextareaField = undefined as any;
export { Tooltip } from './Tooltip';

// NOTE: The undefined placeholders are intentional stubs. Replace them with real
// implementations from the design system as you migrate components. This file
// provides a single import surface so the codebase can progressively adopt
// shadcn-style imports without changing color variables or structure.

export default {
    Button,
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    Input,
    Label,
    Textarea,
    Reveal,
    ImageCropper,
    Select,
    Checkbox,
};
