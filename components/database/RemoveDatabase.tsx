import { getAxiosError } from '@/lib/common';
import type { Project } from '@prisma/client';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Modal } from 'react-daisyui';
import toast from 'react-hot-toast';

const RemoveDatabase = ({
  visible,
  setVisible,
  project,
  value
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  project: Project;
  value: any;
}) => {
  const { t } = useTranslation('common');

  const handleRemoveDatabase = async () => {
    try {
      await axios.delete(
        `/api/database/remove/${project.id}`,
      );
      
      toast.success(t('remove-success'));
      setVisible(false);
      value(null);
    } catch (error: any) {
      toast.error(getAxiosError(error));
    }
  }

  return (
    <Modal open={visible}>
        <Modal.Header className="font-bold">
          {t('remove-database')}
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2 flex flex-col space-y-4">
            <p>{t('remove-database-message')}</p>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            type="submit"
            color="error"
            onClick={handleRemoveDatabase}
          >
            {t('remove-button-message')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {t('close')}
          </Button>
        </Modal.Actions>
    </Modal>
  );
};

export default RemoveDatabase;
