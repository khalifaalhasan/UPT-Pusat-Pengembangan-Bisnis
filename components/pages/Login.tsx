'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Mail, User, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';

// Shadcn UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Handle Login
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Handle Email Not Confirmed
      if (error.message.includes("Email not confirmed")) {
        setIsRegisterSuccess(true);
        setLoading(false);
        return;
      }
      setErrorMsg(error.message === 'Invalid login credentials' ? 'Email atau password salah' : error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push('/'); // Redirect ke home setelah login sukses
    }
  };

  // Handle Register
  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/auth/callback` 
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setIsRegisterSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      
      {/* Tombol Kembali ke Home (Pojok Kiri Atas) */}
      <Link href="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-blue-600 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
      </Link>

      <Card className="w-full max-w-md shadow-xl border-gray-200">
        
        {/* VIEW 1: SUKSES REGISTER / BUTUH VERIFIKASI */}
        {isRegisterSuccess ? (
          <CardContent className="pt-10 pb-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cek Email Anda</h2>
            <p className="text-gray-500 text-sm mb-6 px-4">
              Kami telah mengirimkan link verifikasi ke <strong>{email}</strong>.<br/>
              Silakan klik link tersebut untuk mengaktifkan akun Anda.
            </p>
            <Button variant="outline" onClick={() => { setIsRegisterSuccess(false); setActiveTab('login'); }} className="w-full">
              Kembali ke Login
            </Button>
          </CardContent>
        ) : (
          
          /* VIEW 2: FORM LOGIN/REGISTER */
          <>
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-2">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-600">
                Pusat Bisnis
              </CardTitle>
              <CardDescription>
                Masuk atau daftar untuk mengelola pesanan.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Masuk</TabsTrigger>
                  <TabsTrigger value="register">Daftar</TabsTrigger>
                </TabsList>

                {/* TAB LOGIN */}
                <TabsContent value="login">
                  <form onSubmit={onLogin} className="space-y-4">
                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200 flex items-center gap-2">
                        <div className="h-2 w-2 bg-red-600 rounded-full" />
                        {errorMsg}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email-login" 
                          type="email" 
                          placeholder="nama@email.com" 
                          className="pl-10" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pass-login">Password</Label>
                        <Link href="#" className="text-xs text-blue-600 hover:underline">Lupa password?</Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="pass-login" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Masuk Sekarang'}
                    </Button>
                  </form>
                </TabsContent>

                {/* TAB REGISTER */}
                <TabsContent value="register">
                  <form onSubmit={onRegister} className="space-y-4">
                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
                        {errorMsg}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name-reg">Nama Lengkap</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="name-reg" 
                          placeholder="Budi Santoso" 
                          className="pl-10" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-reg">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email-reg" 
                          type="email" 
                          placeholder="nama@email.com" 
                          className="pl-10" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pass-reg">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="pass-reg" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Daftar Akun Baru'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}