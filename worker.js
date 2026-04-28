
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemendek URL - Shortlink Generator</title>
    <meta name="description" content="Pemendek URL gratis, cepat, dan mudah. Buat shortlink dalam hitungan detik!">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
    
    <!-- Optional: Manifest for PWA -->
    <link rel="manifest" href="/site.webmanifest">
    <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState } = React;

        // Icons
        const Copy = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
        );

        const Check = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
            </svg>
        );

        function URLShortener() {
            const [urls, setUrls] = useState('');
            const [customSlug, setCustomSlug] = useState('');
            const [selectedDomain, setSelectedDomain] = useState('videyt.icu');
            const [shortLinks, setShortLinks] = useState([]);
            const [loading, setLoading] = useState(false);
            const [copiedIndex, setCopiedIndex] = useState(null);
            const [error, setError] = useState('');
            const [success, setSuccess] = useState('');

            // Domain list - GANTI DENGAN DOMAIN ANDA!
            const domains = [
                'videyt.icu',
                'cdnn.videyt.icu',
                'doods.videyt.icu',
                'jav.videyt.icu',
                'xxx.videyt.icu'
                
            ];

            const validateURL = (url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            };

            const handleCreateShortlinks = async () => {
                setError('');
                setSuccess('');
                
                const urlList = urls.split('\n').filter(url => url.trim() !== '');

                if (urlList.length === 0) {
                    setError('Masukkan minimal 1 URL');
                    return;
                }

                if (urlList.length > 10) {
                    setError('Maksimal 10 URL per batch');
                    return;
                }

                for (const url of urlList) {
                    if (!validateURL(url.trim())) {
                        setError(`URL tidak valid: ${url}`);
                        return;
                    }
                }

                if (customSlug && customSlug.length < 8) {
                    setError('Slug kustom minimal 8 karakter');
                    return;
                }

                setLoading(true);

                try {
                    const response = await fetch('/api/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            urls: urlList.map(u => u.trim()),
                            customSlug: customSlug,
                            domain: selectedDomain
                        })
                    });

                    const result = await response.json();

                    if (result.success) {
                        setShortLinks(result.data);
                        setSuccess(`${result.data.length} shortlink berhasil dibuat!`);
                    } else {
                        setError(result.error || 'Gagal membuat shortlink');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setError('Gagal membuat shortlink. Silakan coba lagi.');
                } finally {
                    setLoading(false);
                }
            };

            const copyToClipboard = async (text, index) => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopiedIndex(index);
                    setTimeout(() => setCopiedIndex(null), 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            };

            const copyAllLinks = async () => {
                const allUrls = shortLinks.map(link => link.short_url).join('\n');
                try {
                    await navigator.clipboard.writeText(allUrls);
                    setCopiedIndex(-1);
                    setTimeout(() => setCopiedIndex(null), 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            };

            const resetForm = () => {
                setShortLinks([]);
                setUrls('');
                setCustomSlug('');
                setError('');
                setSuccess('');
                setCopiedIndex(null);
            };

            return (
                <div className="min-h-screen py-12 px-4">
                    <div className="max-w-3xl mx-auto">
                        
                        {/* Form Input - Show only when no results */}
                        {shortLinks.length === 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                                {/* Logo */}
                                <div className="flex justify-center mb-6">
                                    <img 
                                        src="/assets/logo.png" 
                                        alt="Logo" 
                                        className="h-16 w-auto"
                                    />
                                </div>
                                
                                <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
                                    Pemendek URL
                                </h1>

                                {/* URL Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-normal text-gray-700 mb-2">
                                        Pendekkan Massal (Maks 10 URL, satu URL per baris):
                                    </label>
                                    <textarea
                                        value={urls}
                                        onChange={(e) => setUrls(e.target.value)}
                                        placeholder="https://contoh1.com&#10;https://contoh2.com"
                                        className="w-full h-32 px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Custom Slug */}
                                <div className="mb-6">
                                    <label className="block text-sm font-normal text-gray-700 mb-2">
                                        Slug Kustom Opsional (min 8 karakter):
                                    </label>
                                    <input
                                        type="text"
                                        value={customSlug}
                                        onChange={(e) => setCustomSlug(e.target.value)}
                                        placeholder="contohslug123"
                                        className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Domain Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-normal text-gray-700 mb-2">
                                        Pilih Domain:
                                    </label>
                                    <select
                                        value={selectedDomain}
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                    >
                                        {domains.map(domain => (
                                            <option key={domain} value={domain}>{domain}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Create Button */}
                                <button
                                    onClick={handleCreateShortlinks}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? 'Membuat...' : 'Buat Shortlink(s)'}
                                </button>

                                {/* Info Section */}
                                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                                    <h2 className="flex items-center text-lg font-semibold text-blue-600 mb-4">
                                        💡 Mengapa Menggunakan Pemendek URL Kami?
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold text-gray-900">Pendekkan URL Instan</span> — Tempel URL target & klik tombol "Buat Shortlink" untuk memendekkannya seketika. Tidak ada penundaan atau timer.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold text-gray-900">Gratis, Cepat & Aman</span> — Tidak ada registrasi, pendaftaran, login, akun, rencana, kartu, pembayaran, periode uji coba.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold text-gray-900">Opsi Domain Berganda (Segera Hadir)</span> — Pilih dari berbagai domain untuk membuat shortlink bermerek yang sesuai dengan kebutuhan Anda.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Section - Show after creation */}
                        {shortLinks.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                {/* Logo (smaller on results page) */}
                                <div className="flex justify-center mb-4">
                                    <img 
                                        src="/assets/logo.png" 
                                        alt="Logo" 
                                        className="h-12 w-auto"
                                    />
                                </div>
                                
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Shortlink Berhasil Dibuat! 🎉
                                    </h3>
                                    <p className="text-gray-600">
                                        {shortLinks.length} link berhasil dibuat
                                    </p>
                                </div>

                                {/* List of Created Links */}
                                <div className="space-y-3 mb-6">
                                    {shortLinks.map((link, index) => (
                                        <div key={link.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-green-800 mb-1">
                                                        Shortlink berhasil: {link.short_url}
                                                    </p>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {link.original_url}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(link.short_url, index)}
                                                    className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    {copiedIndex === index ? (
                                                        <>
                                                            <Check />
                                                            Tersalin!
                                                        </>
                                                    ) : (
                                                        'Salin'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {/* Copy All Button */}
                                    <button
                                        onClick={copyAllLinks}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {copiedIndex === -1 ? (
                                            <>
                                                <Check />
                                                Tersalin Semua!
                                            </>
                                        ) : (
                                            'Salin Semua'
                                        )}
                                    </button>

                                    {/* Create New Button */}
                                    <button
                                        onClick={resetForm}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                                    >
                                        🔄 Buat Link Baru Lagi
                                    </button>
                                </div>

                                {/* Link to Admin */}
                                <div className="mt-6 text-center">
                                    <a 
                                        href="/admin" 
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2
