import Topbar from '../components/layout/Topbar';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <main className="p-[26px_30px_50px]">
        <div className="bg-surface border border-border rounded-card p-5 text-center text-ink-2">
          <p className="text-[14px]">หน้า "{title}" — อยู่ระหว่างพัฒนา</p>
        </div>
      </main>
    </>
  );
}
