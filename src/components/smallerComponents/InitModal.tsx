import { Modal, Text } from "@mantine/core";
import { useState, useEffect } from "react";
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
      title={<Text weight={700} align="center" underline>{title}</Text>}
    >
      {children}
    </Modal>
  );
};
