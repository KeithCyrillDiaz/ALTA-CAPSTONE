import { useEffect, useState } from "react";


const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    //ADD THE .DISBALE-SCROLL CSS TO BODY WHEN MODAL IS OPEN TO DISABLE SCOLL INSHORT
    useEffect(() => {
        if (isModalOpen) {
          document.body.classList.add("disable-scroll");
        } else {
          document.body.classList.remove("disable-scroll");
        }
      }, [isModalOpen]);

      return {
        isModalOpen,
        setIsModalOpen
      }
}

export default useModal;