import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import ProductAdminForm from '../ProductAdminForm';
import { DataProps } from '../../types';
import CategoryAdminForm from '../CategoryAdminForm';
import ClientAdminForm from '../ClientAdminForm';
import OrderAdminForm from '../OrderAdminForm';

interface ModalAdminProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: () => void;
  category: 'product' | 'category' | 'user' | 'cart';
  categoryTranslation: string;
  selectedItemData: DataProps | undefined;
  isEdit: boolean;
}

export default function ModalAdmin({
  isOpen,
  setIsOpen,
  onClose,
  category,
  categoryTranslation,
  selectedItemData,
  isEdit = false
}: ModalAdminProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader sx={{ marginTop: '20px' }}>
          {isEdit ? 'Editar' : 'Criar'}  {categoryTranslation} 
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={20}>
          {category === 'product' && (
            <ProductAdminForm 
              setIsOpen={setIsOpen}
              data={selectedItemData}
              onClose={onClose}
            />
          )}
          {category === 'category' && (
            <CategoryAdminForm
              setIsOpen={setIsOpen}
              data={selectedItemData}
              onClose={onClose}
              
            />
          )}
          {category === 'user' && (
            <ClientAdminForm
              setIsOpen={setIsOpen}
              data={selectedItemData}
              onClose={onClose}
              
            />
          )}
          {category === 'cart' && (
            <OrderAdminForm
              setIsOpen={setIsOpen}
              data={selectedItemData}
              onClose={onClose}
              
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
