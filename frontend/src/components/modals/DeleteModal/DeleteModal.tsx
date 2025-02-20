import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import ModalLayout from "@/components/modals/ModalLayout";
import { ModalType } from "@/types/enum/modal.enum";
import { currentOpenModalState } from "@/recoil/atom";
import { ICurrentModalStateInfo } from "@/types/interface/modal.interface";
import { currentBoardIdState } from "@/recoil/atom";
import useModal from "@/hooks/useModal";
import useToaster from "@/hooks/useToaster";
import { deleteInfoState } from "@/recoil/atom";
import { IDeleteInfo } from "@/types/interface/option.interface";
import { axiosDeleteBoard, axiosDeleteComment } from "@/api/axios/axios.custom";
import { useResetRecoilState } from "recoil";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { IBoardInfo } from "@/types/interface/board.interface";
import { boardCategoryState } from "@/recoil/atom";
import { Board } from "@/types/enum/board.category.enum";
import { CommentInfoDTO } from "@/types/dto/board.dto";

const DeleteModal = () => {
  const [currentOpenModal] = useRecoilState<ICurrentModalStateInfo>(
    currentOpenModalState
  );
  const [currentBoardId] = useRecoilState<number | null>(currentBoardIdState);
  const [deleteInfo] = useRecoilState<IDeleteInfo>(deleteInfoState);
  const [boardCategory] = useRecoilState<Board>(boardCategoryState);
  const resetDeleteInfo = useResetRecoilState(deleteInfoState);
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const { popToast } = useToaster();

  const deleteContent = async () => {
    if (deleteInfo.boardId) await axiosDeleteBoard(deleteInfo.boardId);
    if (deleteInfo.commentId) await axiosDeleteComment(deleteInfo.commentId);
    resetDeleteInfo();
    closeModal(ModalType.DELETE);
    popToast("해당 글이 삭제되었습니다.", "P");
  };

  const commentMutation = useMutation(deleteContent, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["comments", currentBoardId]);

      const comments: CommentInfoDTO[] | undefined =
        await queryClient.getQueryData(["comments", currentBoardId]);

      await queryClient.setQueryData(
        ["boards", boardCategory],
        (prevData: IBoardInfo[] | any) => {
          if (!prevData) return prevData;

          const lastComment: CommentInfoDTO | null =
            comments && comments.length > 0
              ? comments[comments.length - 1]
              : null;

          const updatedBoards = prevData.map((board: IBoardInfo) => {
            if (board.boardId === currentBoardId) {
              return {
                ...board,
                commentCount: board.commentCount - 1,
                previewCommentUser:
                  (lastComment && lastComment.memberName) ?? null,
                previewComment: (lastComment && lastComment.comment) ?? null,
              };
            }
            return board;
          });
          return updatedBoards;
        }
      );
    },
  });

  const boardMutation = useMutation(deleteContent, {
    onSuccess: async () => {
      await queryClient.setQueryData(
        ["boards", boardCategory],
        (prevData: IBoardInfo[] | any) => {
          if (!prevData) return prevData;
          const updatedBoards: IBoardInfo[] = prevData.filter(
            (board: IBoardInfo) => board.boardId !== deleteInfo.boardId
          );
          return updatedBoards;
        }
      );
    },
  });

  return (
    <ModalLayout
      modalName={ModalType.DELETE}
      isOpen={currentOpenModal.deleteModal}
    >
      <WrapperStyled>
        {deleteInfo.commentId ? (
          <>
            <h1>댓글 삭제</h1>
            <ContentStyled>해당 댓글을 삭제하시겠습니까?</ContentStyled>
            <button onClick={() => commentMutation.mutate()}>삭제</button>
          </>
        ) : (
          <>
            <h1>게시물 삭제</h1>
            <ContentStyled>해당 게시물을 삭제하시겠습니까?</ContentStyled>
            <button onClick={() => boardMutation.mutate()}>삭제</button>
          </>
        )}
      </WrapperStyled>
    </ModalLayout>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 105px;
  background-color: var(--white);
  border-radius: 10px;
  color: var(--grey);
  h1 {
    font-size: 1.4rem;
    font-weight: 500;
    margin-top: 15px;
    margin-bottom: 5px;
  }
  button {
    cursor: pointer;
    margin-top: 10px;
    height: 50px;
    width: 100%;
    border: none;
    background-color: transparent;
    color: var(--red);
    border: none;
    border-top: 0.5px solid #eaeaea;
    font-weight: 500;
    font-size: 1.2rem;
  }
`;

const ContentStyled = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  padding: 0px 40px;
`;

export default DeleteModal;
