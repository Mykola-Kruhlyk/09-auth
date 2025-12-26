'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

interface ModalWrapperProps {
  children: React.ReactNode;
}

export default function ModalWrapper({ children }: ModalWrapperProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  // Якщо children порожній (default.tsx), не рендеримо модалку
  if (!children) {
    return null;
  }

  return <Modal onClose={handleClose}>{children}</Modal>;
}