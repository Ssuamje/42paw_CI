import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isRightSectionOpenedState } from "../recoil/atom";
import { boardCategoryState } from "@/recoil/atom";
import { Board } from "@/types/enum/board.category.enum";

/**useNavigate를 통해 라우트 간 이동할 때마다 RightSection을 Close해 주기 위한 훅 */
const useNavigateCustom = () => {
  const setIsRightSectionOpened = useSetRecoilState<boolean>(
    isRightSectionOpenedState
  );
  const setBoard = useSetRecoilState<Board>(boardCategoryState);
  const navigator = useNavigate();

  const moveToMain = () => {
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/");
  };

  const moveToNotice = () => {
    // 라우트 전환 시, Board를 default로 전환해 주지 않으면 이전 카테고리 게시글이 남아있는 현상을 방지
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/notice");
  };

  const moveToMyProfile = () => {
    // 라우트 전환 시, Board를 default로 전환해 주지 않으면 이전 카테고리 게시글이 남아있는 현상을 방지
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/my-profile");
  };

  const moveToProfile = () => {
    // 라우트 전환 시, Board를 default로 전환해 주지 않으면 이전 카테고리 게시글이 남아있는 현상을 방지
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/profile");
  };

  const moveToUpload = () => {
    // 라우트 전환 시, Board를 default로 전환해 주지 않으면 이전 카테고리 게시글이 남아있는 현상을 방지
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/upload");
  };

  const moveToDashboard = () => {
    // 라우트 전환 시, Board를 default로 전환해 주지 않으면 이전 카테고리 게시글이 남아있는 현상을 방지
    setBoard(Board.DEFAULT);
    setIsRightSectionOpened(false);
    navigator("/dashboard");
  };

  return {
    moveToMain,
    moveToNotice,
    moveToProfile,
    moveToMyProfile,
    moveToUpload,
    moveToDashboard,
  };
};

export default useNavigateCustom;
