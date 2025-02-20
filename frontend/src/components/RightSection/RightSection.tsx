import styled, { keyframes } from "styled-components";
import {
  isRightSectionOpenedState,
  rightSectionContentState,
} from "@/recoil/atom";
import { useRecoilState } from "recoil";
import CommentSection from "@/components/RightSection/CommentSection/CommentSection";
import SearchSection from "@/components/RightSection/SearchSection/SearchSection";
import AnimalFilterSection from "@/components/RightSection/AnimalFilterSection/AnimalFilterSection";
import useRightSectionHandler from "@/hooks/useRightSectionHandler";
import { IRightSectionContentInfo } from "@/types/interface/right.section.interface";

const RightSection = () => {
  const [isRightSectionOpened] = useRecoilState<boolean>(
    isRightSectionOpenedState
  );
  const [rightSectionContent] = useRecoilState<IRightSectionContentInfo>(
    rightSectionContentState
  );
  const { closeRightSection } = useRightSectionHandler();

  return (
    <>
      <RightSectionStyled $isRightSectionOpened={isRightSectionOpened}>
        <CloseButtonContainerStyled>
          {/* {rightSectionContent.search && <SearchBar /> } */}
          <CloseButtonStyled onClick={closeRightSection}>
            <img src="/src/assets/exitW.png" />
          </CloseButtonStyled>
        </CloseButtonContainerStyled>
        <RightSectionBodyStyled>
          {rightSectionContent.comment && <CommentSection />}
          {rightSectionContent.search && <SearchSection />}
          {rightSectionContent.animalFilter && <AnimalFilterSection />}
        </RightSectionBodyStyled>
      </RightSectionStyled>
      {isRightSectionOpened && <OverlayStyled onClick={closeRightSection} />}
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const OverlayStyled = styled.div`
  z-index: 3;
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.5s;
  backdrop-filter: blur(5px);
  @media (max-width: 1023px) {
    display: flex;
  }
`;

const RightSectionStyled = styled.div<{
  $isRightSectionOpened: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 460px;
  height: 700px;
  max-height: 860px;
  margin-left: 20px;
  border-radius: 30px;
  background-color: var(--transparent);
  box-shadow: var(--default-shadow);
  margin-right: ${(props) => (props.$isRightSectionOpened ? "0px" : "-480px")};
  opacity: ${(props) => (props.$isRightSectionOpened ? 1 : 0)};
  transition: opacity 0.5s ease-in-out, margin-right 0.5s ease-in-out;
  @media (max-width: 1023px) {
    z-index: 4;
    height: ${(props) => (props.$isRightSectionOpened ? "85%" : "0%")};
    background-color: #dbdcfec3;
    position: absolute;
    width: 100%;
    bottom: 0;
    transition: height 0.3s ease;
    margin-left: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    * {
      display: ${(props) => !props.$isRightSectionOpened && "none"};
    }
  }
`;

const CloseButtonContainerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 45px;
  border-bottom: 1px solid var(--transparent);
`;

const CloseButtonStyled = styled.button`
  width: 32px;
  background-color: transparent;
  border: none;
  margin-right: 12px;
  margin-top: 5px;
  img {
    cursor: pointer;
    width: 100%;
  }
  img:hover {
    opacity: 0.7;
  }
`;

const RightSectionBodyStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 45px);
  width: 100%;
`;
export default RightSection;
