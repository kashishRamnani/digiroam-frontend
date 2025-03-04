import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title={t('notFound.title')} description={t('notFound.description')}>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('notFound.heading')}</h1>
        <p className="text-xl mb-8">{t('notFound.message')}</p>
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;

