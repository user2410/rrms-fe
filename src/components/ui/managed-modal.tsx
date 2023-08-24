"use client";

import Modal from '@components/ui/modal';
import dynamic from 'next/dynamic';
import { useModalAction, useModalState } from '@context/modal.context';

const AuthModal = dynamic(() => import('@components/page/main-app/auth.modal'));
const ForgetPasswordModal = dynamic(() => import('@components/page/main-app/forget-pass.modal'));

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
