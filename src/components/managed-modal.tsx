"use client";

import Modal from '@components/ui/modal';
import dynamic from 'next/dynamic';
import { useModalAction, useModalState } from '@context/modal.context';

const AuthModal = dynamic(() => import('@/app/(main-app)/_components/auth.modal'));
const ForgetPasswordModal = dynamic(() => import('@/app/(main-app)/_components/forget-pass.modal'));

export default function ManagedModal() {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {view === 'AUTH_VIEW' && <AuthModal/>}
      {view === 'FORGET_PASSWORD' && <ForgetPasswordModal />}
    </Modal>
  );
}
