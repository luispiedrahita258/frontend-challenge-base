'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="es">
      <head>
        <title>Aplicación de Películas</title>
        <meta
          name="description"
          content="Aplicación de películas que muestra películas populares y mejor valoradas"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <header>
            <nav className="navbar">
              <div className="navbar-links">
                <a href="/">Inicio</a>
                <a href="/popular">Populares</a>
                <a href="/movie/favorites">Favoritos</a>
                <a href="/contact">Contacto</a>
              </div>
              <div className="navbar-login">
                <a href="/login" className="login-btn">
                  Iniciar Sesión
                </a>
                <button className="theme-switcher" onClick={toggleTheme}>
                  {theme === 'light' ? '🌞 Claro' : '🌜 Oscuro'}
                </button>
              </div>
            </nav>
          </header>

          <main>{children}</main>

          <footer>
            <p>
              © 2024 Aplicación de Películas. Todos los derechos reservados.
            </p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
