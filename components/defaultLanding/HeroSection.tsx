import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  const { t } = useTranslation('common');
  return (
    <div className="hero py-42">
      <div className="hero-content text-center">
        <div className="max-w-7md">
          {/* My logo */}
          <Image
            src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81okqmUGTG9YOoa34NsZd4dG0MXoh805rcLZs4SMgqA6p0tI9dVkxlwQp5aljcZCHwtwAUOltSHr3OyL3UTmnZy3-_0UfQ=s1600"
            className="mx-auto"
            width={274} 
            height={140}
            alt="SaasHQ"
          />
          <h1 className="text-5xl font-bold"> {t('enterprise-saas-kit')}</h1>
          <p className="py-6 text-2xl font-normal">
            {t('kickstart-your-enterprise')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link 
              href="/auth/join" 
              className="btn-primary btn px-8 no-underline"
            >
                {t('get-started')}
            </Link>
            <Link 
              href="https://github.com/kubeworkz/saashq"
              className="btn-outline btn px-8"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
