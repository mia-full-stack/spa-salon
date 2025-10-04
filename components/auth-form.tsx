"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(" Auth Form: Attempting login with email:", loginEmail);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: loginEmail,
          password: loginPassword,
        }),
      });

      console.log(" Auth Form: Login response status:", response.status);
      const data = await response.json();
      console.log(" Auth Form: Login response data:", data);

      if (!response.ok) {
        toast({
          title: "Ошибка входа",
          description: data.error || "Неверный email или пароль",
          variant: "destructive",
        });
        return;
      }

      console.log(
        " Auth Form: Saving user to localStorage with key 'spa_current_user':",
        data.user
      );
      localStorage.setItem("spa_current_user", JSON.stringify(data.user));

      toast({
        title: "Добро пожаловать!",
        description: `Вы успешно вошли в систему`,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(" Auth Form: Login error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при входе",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log(" Auth Form: Attempting registration with data:", {
        email: registerEmail,
        name: registerName,
        phone: registerPhone,
      });

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email: registerEmail,
          password: registerPassword,
          name: registerName,
          phone: registerPhone,
        }),
      });

      console.log(" Auth Form: Registration response status:", response.status);
      const data = await response.json();
      console.log(" Auth Form: Registration response data:", data);

      if (!response.ok) {
        toast({
          title: "Ошибка регистрации",
          description:
            data.error || "Пользователь с таким email уже существует",
          variant: "destructive",
        });
        return;
      }

      console.log(
        " Auth Form: Saving user to localStorage with key 'spa_current_user':",
        data.user
      );
      localStorage.setItem("spa_current_user", JSON.stringify(data.user));

      toast({
        title: "Регистрация успешна!",
        description: "Добро пожаловать в наш спа-салон",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(" Auth Form: Registration error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Личный кабинет</CardTitle>
        <CardDescription>Войдите или создайте новый аккаунт</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name">Имя</Label>
                <Input
                  id="register-name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-phone">Телефон</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="+49 (123) 456-78-90"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-confirm-password">
                  Подтвердите пароль
                </Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
