import * as React from 'react';
import { Button, Card, CardContent, CardFooter, CardHeader, Input, Label } from './ui';
import { BorderBeam } from '../registry/magicui/border-beam';

interface Props {
    email: string;
    password: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onLogin: (e: React.FormEvent) => void;
    loading?: boolean;
}

export const LoginCard: React.FC<Props> = ({ email, password, onEmailChange, onPasswordChange, onLogin, loading = false }) => {
    return (
        <Card className="relative w-[350px] overflow-hidden">
            <CardHeader>
                <h3 className="text-xl font-serif">Login</h3>
                <p className="text-sm opacity-70 mt-1">Enter your credentials to access your account.</p>
            </CardHeader>

            <form onSubmit={onLogin}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => onEmailChange(e.target.value)} disabled={loading} />
                            </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => onPasswordChange(e.target.value)} disabled={loading} />
                        </div>
                    </div>
                </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
                    </CardFooter>
            </form>

            <BorderBeam duration={8} size={100} />
        </Card>
    );
};

export default LoginCard;
