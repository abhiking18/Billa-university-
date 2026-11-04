interface PageCurtainProps {
  isWiping: boolean;
}

export default function PageCurtain({ isWiping }: PageCurtainProps) {
  return (
    <div
      className={`fixed inset-0 bg-black z-[9990] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-white/40 ${
        isWiping ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    />
  );
}
