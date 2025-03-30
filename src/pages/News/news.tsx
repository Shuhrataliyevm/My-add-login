import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './News.scss';

interface Transaction {
    id: string;
    date: string;
    amount: number;
    paid_amount: number;
    next_payment_date: string;
}

interface DebtorDetails {
    id: string;
    total_debt: number;
    transactions: Transaction[];
}

const News = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [debtorDetails, setDebtorDetails] = useState<DebtorDetails | null>(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString().slice(0, 5),
        duration: '',
        amount: '',
        note: '',
        images: [] as File[]
    });

    useEffect(() => {
        const fetchDebtorDetails = async () => {
            try {
                setLoading(true);
                const mockData: DebtorDetails = {
                    id: '1',
                    total_debt: 14786000,
                    transactions: [
                        {
                            id: '1',
                            date: 'Nov 1, 2024 14:51',
                            amount: 5845000,
                            paid_amount: 500000,
                            next_payment_date: '07.11.2024'
                        }
                    ]
                };
                setDebtorDetails(mockData);
            } catch (error) {
                console.error('Error fetching debtor details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDebtorDetails();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="success-screen">
                <img src="/icons/newLoginImages.svg" alt="" />
                <h1>Ajoyib!</h1>
                <p>Muvaffaqiyatli so'ndirildi</p>
                <button className="add-button" onClick={() => navigate('/products')}>
                    O'tqazish
                </button>
            </div>
        );
    }

    if (showForm) {
        return (
            <form className="transaction-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <button 
                        type="button" 
                        className="back-button" 
                        onClick={() => setShowForm(false)}
                    >
                        ←
                    </button>
                    <h1>Batafsil</h1>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Sana</label>
                    <input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time">Soat</label>
                    <input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="duration">Muddat</label>
                    <input
                        id="duration"
                        type="number"
                        placeholder="12"
                        value={formData.duration}
                        onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Summa muddati</label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="5,845,000"
                        value={formData.amount}
                        onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="note">Eslatma</label>
                    <textarea
                        id="note"
                        placeholder="iPhone 14 Pro, boshlanish to'lov bor"
                        value={formData.note}
                        onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    />
                </div>

                <div className="image-upload">
                    <div className="upload-title">Rasm biriktirish</div>
                    <div className="image-upload-container">
                        <label className="image-upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: [e.target.files![0], prev.images[1]].filter(Boolean)
                                        }));
                                    }
                                }}
                                hidden
                            />
                            {formData.images[0] ? (
                                <img 
                                    src={URL.createObjectURL(formData.images[0])} 
                                    alt="Preview" 
                                    className="preview-image"
                                />
                            ) : (
                                <>
                                    <span className="upload-icon">📷</span>
                                    <span>Расм қўшиш</span>
                                </>
                            )}
                        </label>

                        <label className="image-upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: [prev.images[0], e.target.files![0]].filter(Boolean)
                                        }));
                                    }
                                }}
                                hidden
                            />
                            {formData.images[1] ? (
                                <img 
                                    src={URL.createObjectURL(formData.images[1])} 
                                    alt="Preview" 
                                    className="preview-image"
                                />
                            ) : (
                                <>
                                    <span className="upload-icon">📷</span>
                                    <span>Расм қўшиш</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <button type="submit" className="add-button">
                    Nasiyani so'ndirish
                </button>
            </form>
        );
    }

    return (
        <div className="debtor-details">
            <div className="header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h1>Avazbek Solijonov</h1>
                <button id="star-button">⭐</button>
                <button id="more-button">⋮</button>
            </div>

            <div className="debt-header">
                <h2>Umumiy nasiya</h2>
                <div className="total-amount">
                    {new Intl.NumberFormat('uz-UZ').format(debtorDetails?.total_debt || 0)} so'm
                </div>
            </div>

            <div className="section-title">Faol nasiyalar</div>

            <div className="transactions-list">
                {debtorDetails?.transactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                        <div className="transaction-header">
                            <div className="transaction-date">{transaction.date}</div>
                            <div className="transaction-amount">
                                {new Intl.NumberFormat('uz-UZ').format(transaction.amount)} so'm
                            </div>
                        </div>
                        
                        <div className="payment-info">
                            <div className="next-payment">
                                Keyingi to'lov: {transaction.next_payment_date}
                            </div>
                            <div className="payment-amount">
                                {new Intl.NumberFormat('uz-UZ').format(transaction.paid_amount)} so'm
                            </div>
                        </div>

                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{ 
                                    width: `${(transaction.paid_amount / transaction.amount) * 100}%` 
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button 
                className="add-button" 
                onClick={() => setShowForm(true)}
            >
                Qo'shish
            </button>
        </div>
    );
};

export default News;