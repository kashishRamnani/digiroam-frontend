import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const Unauthorized = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title={t('unauthorized.title')} description={t('unauthorized.description')}>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('unauthorized.heading')}</h1>
        <p className="text-xl mb-8 text-gray-700">{t('unauthorized.message')}</p>
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t('unauthorized.backHome')}
        </Link>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
