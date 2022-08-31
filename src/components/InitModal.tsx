import { Modal } from "@mantine/core";
import { useState, useEffect, Children } from "react";
export default ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setModalOpen(true);
  }, []);
  return (
    <Modal
      transition="rotate-left"
      centered
      opened={modalOpen}
      onClose={() => setModalOpen(false)}
      title={title}
    >
      {children}
    </Modal>
  );
};
