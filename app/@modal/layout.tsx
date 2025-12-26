import ModalWrapper from '@/components/ModalWrapper/ModalWrapper';

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModalWrapper>{children}</ModalWrapper>;
}
