import * as React from 'react';
import { Button, Card, CardContent, CardFooter, CardHeader, Input, Label } from './ui';
import { BorderBeam } from '../registry/magicui/border-beam';

interface Props {
    email: string;
    password: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onLogin: (e: React.FormEvent) => void;
    onRegister?: () => void;
}

export const LoginCard: React.FC<Props> = ({ email, password, onEmailChange, onPasswordChange, onLogin, onRegister }) => {
    return (
        <Card className="relative w-[350px] overflow-hidden">
            <CardHeader>
                <h3 className="text-xl font-serif">Login</h3>
                <p className="text-sm opacity-70 mt-1">Enter your credentials to access your account.</p>
            </CardHeader>

            <CardContent>
                <form onSubmit={onLogin}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => onEmailChange(e.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => onPasswordChange(e.target.value)} />
                        </div>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onRegister}>Register</Button>
                <Button type="submit" onClick={(e) => onLogin(e as any)} >Login</Button>
            </CardFooter>

            <BorderBeam duration={8} size={100} />
        </Card>
    );
};

export default LoginCard;
