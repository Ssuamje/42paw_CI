import { useRecoilState } from "recoil";
import { ICurrentModalStateInfo } from "@/types/interface/modal.interface";
import { currentOpenModalState } from "@/recoil/atom";
import BanModal from "@/components/modals/BanModal/BanModal";
import ReportModal from "@/components/modals/ReportModal/ReportModal";
import ProfileCardModal from "@/components/modals/ProfileCardModal/ProfileCardModal";
import ProfileEditModal from "@/components/modals/ProfileEditModal/ProfileEditModal";
import DeleteModal from "@/components/modals/DeleteModal/DeleteModal";
import LanguageModal from "@/components/modals/LanguageModal/LanguageModal";
import instance from "@/api/axios/axios.instance";
import { STATUS_401_UNAUTHORIZED } from "@/types/constants/StatusCode";
import useModal from "@/hooks/useModal";
import { ModalType } from "@/types/enum/modal.enum";

const ModalContainer = () => {
  const [currentOpenModal] = useRecoilState<ICurrentModalStateInfo>(
    currentOpenModalState
  );
  const { openModal } = useModal();

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === STATUS_401_UNAUTHORIZED) {
        openModal(ModalType.LANGUAGE);
      }
      return Promise.reject(error);
    }
  );

  return (
    <>
      {currentOpenModal.banModal && <BanModal />}
      {currentOpenModal.reportModal && <ReportModal />}
      {currentOpenModal.profileCardModal && <ProfileCardModal />}
      {currentOpenModal.deleteModal && <DeleteModal />}
      {currentOpenModal.profileEditModal && <ProfileEditModal />}
      {currentOpenModal.languageModal && <LanguageModal />}
    </>
  );
};

export default ModalContainer;
