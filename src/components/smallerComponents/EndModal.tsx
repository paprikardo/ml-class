import { Modal } from "@mantine/core";
export default ({
  opened,
  title,
  children,
  onClose,
}: {
  opened: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <Modal
      transition="rotate-left"
      centered
      opened={opened}
      onClose={onClose}
      title={title}
    >
      {children}
    </Modal>
  );
};
