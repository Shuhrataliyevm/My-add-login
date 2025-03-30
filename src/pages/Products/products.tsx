import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileApi from '../../utils/ProfileApi';
import './products.scss';

interface Debtor {
    id: string;
    created_at: string;
    updated_at: string;
    full_name: string;
    address: string;
    description: string;
    store: string;
    phone_numbers: string[];
    images: string[];
    amount: number;
    is_starred: boolean;
}

interface ApiError {
    response?: {
        status: number;
        data?: {
            message: string;
        };
    };
    message: string;
}

const LoadingScreen = () => (
    <div className="splash-screen">
        <div className="splash-content">
            <img 
                src="/icons/newlogo.svg" 
                alt="Logo" 
                className="splash-logo"
            />
            <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    </div>
);

const Products = () => {
    const [debtors, setDebtors] = useState<Debtor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const navigate = useNavigate();

    const fetchDebtors = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ProfileApi.getDebtors();
            setDebtors(data);
            setError(null);
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || "Ma'lumotlarni yuklashda xatolik");
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDebtors();
    }, [fetchDebtors]);

    const toggleStar = useCallback(async (debtorId: string) => {
        setDebtors(prevDebtors =>
            prevDebtors.map(d => d.id === debtorId ? { ...d, is_starred: !d.is_starred } : d)
        );
    }, []);

    const filteredDebtors = useMemo(() =>
        debtors.filter(debtor => {
            const searchLower = search.toLowerCase();
            return (
                debtor.full_name.toLowerCase().includes(searchLower) ||
                debtor.phone_numbers.some(phone => phone.toLowerCase().includes(searchLower)) ||
                debtor.address.toLowerCase().includes(searchLower)
            );
        }), [debtors, search]
    );

    if (loading) return <LoadingScreen />;

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate('/login')}>Tizimga kirish</button>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="header">
                <h1>Mijozlar</h1>
                <div className="button-group">
                    <button onClick={() => navigate('/create-debtor')}>
                        <span>+</span>
                        <span>Yangi mijoz</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="profile-button">
                        Profilga qaytish
                    </button>
                </div>
            </div>

            <input
                type="text"
                placeholder="Mijozlarni qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            <div className="debtor-list">
                {filteredDebtors.map((debtor) => (
                    <div key={debtor.id} className="debtor-card">
                        <div onClick={() => navigate(`/news/${debtor.id}`)} className="card-header">
                            <div className="debtor-info">
                                <h2>{debtor.full_name}</h2>
                                <p>{debtor.phone_numbers?.[0] || 'Telefon raqam kiritilmagan'}</p>
                                <p>{debtor.address}</p>
                            </div>
                            <button
                                onClick={() => toggleStar(debtor.id)}
                                className={`star-button ${debtor.is_starred ? 'starred' : ''}`}
                            >
                                {debtor.is_starred ? '⭐' : '☆'}
                            </button>
                        </div>
                        <p className={`amount ${debtor.amount < 0 ? 'negative' : 'positive'}`}>
                            {new Intl.NumberFormat('uz-UZ').format(debtor.amount)} so'm
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products; 