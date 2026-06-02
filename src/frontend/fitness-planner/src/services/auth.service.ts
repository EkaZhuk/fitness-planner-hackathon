// src/services/auth.service.ts
export interface User {
    username: string;
    hashed_password: string;
    email?: string;
    full_name?: string;
    gender: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    level: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: null;
}

class AuthService {
    private static instance: AuthService;
    // private readonly API_URL = 'http://82.146.61.208:8000'; // FastAPI порт 8000
    private readonly API_URL = 'http://localhost:8000'; // FastAPI порт 8000


    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // Установка токена в cookie (httpOnly не доступен из JS, но мы сохраняем для удобства)
    setToken(token: string, daysToExpire: number = 1): void {
        const date = new Date();
        date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
        document.cookie = `access_token=${token}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
    }

    // Получение токена из cookie
    getToken(): string | null {
        const name = 'access_token=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    // Удаление токена
    removeToken(): void {
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // Проверка авторизации
    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    // Регистрация
    async register(credentials: {
        password: string;
        gender: "male" | "female" | "other";
        weight_kg: number;
        level: "beginner" | "intermediate" | "advanced";
        height_cm: number;
        name: string;
        email: string;
        age: number
    }): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.name,
                    hashed_password: credentials.password,
                    full_name: credentials.name,
                    email: credentials.email,
                    gender: credentials.gender,
                    age: credentials.age,
                    weight_kg: credentials.weight_kg,
                    height_cm: credentials.height_cm,
                    level: credentials.level
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Registration failed');
            }

            // После регистрации сразу логиним
            // 2. После успешной регистрации - логинимся
            const loginResponse = await this.login({
                login: credentials.name,
                password: credentials.password
            });

            return loginResponse;

        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Логин
    async login(credentials: { login: string; password: string }): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  // ← Преобразуем в JSON
                    username: credentials.login,
                    password: credentials.password
                }),
                credentials: 'include', // Важно для получения cookies
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();

            // Сохраняем токен
            if (data.access_token) {
                this.setToken(data.access_token);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Логаут
    async logout(): Promise<void> {
        try {
            await fetch(`${this.API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
        }
    }

    // Получение профиля
    async getProfile(): Promise<any> {
        const token = this.getToken();
        const response = await fetch(`${this.API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return response.json();
    }
}

export const authService = AuthService.getInstance();
