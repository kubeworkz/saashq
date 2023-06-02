import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const HeroSection = () => {
  const { t } = useTranslation('common');
  return (
    <div className="hero py-42">
      <div className="hero-content text-center">
        <div className="max-w-7md">
          <img
            src="https://lh3.googleusercontent.com/drive-viewer/AFGJ81okqmUGTG9YOoa34NsZd4dG0MXoh805rcLZs4SMgqA6p0tI9dVkxlwQp5aljcZCHwtwAUOltSHr3OyL3UTmnZy3-_0UfQ=s1600"
            className="mx-auto" style={{width: "auto", height: "140px", padding: "15px"}}
            alt="SaasHQ"
          />
          <h1 className="text-5xl font-bold"> {t('enterprise-saas-kit')}</h1>
          <p className="py-6 text-2xl font-normal">
            {t('kickstart-your-enterprise')}
          </p>
          <div className="flex items-center justify-center gap-2 ">
            <Link href="/auth/join">
              <a className="btn-primary btn px-8 no-underline">
                {t('get-started')}
              </a>
            </Link>
            <Link href="https://github.com/kubeworkz/saashq">
              <a className="btn-outline btn px-8">GitHub</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
