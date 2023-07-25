/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import plus_green from '../../assets/plus_green.png';
import arrow_left from '../../assets/arrow_left.png';
import arrow_right from '../../assets/arrow_right.png';
import { colors } from '../../utils/colors';

import { useRecoilState } from "recoil";
import { showModalState } from "../../routes/Board";
import { showNavState } from "../../routes/Board";

const SpreadNavWrapper = styled.div`
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 6px;
    box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.2);
    @media (max-width: 800px) {
        display: none;
    }
`;
const FoldNavWrapper = styled.div`
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 6px;
    box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.2);
    border-radius: 45px;
    padding: 6px 4px;
`;
const WidgetListItem = styled.div`
    margin: 2px 0px;
    padding: 8px 16px;
    font-size: 16px;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${colors.overlay_grey};
    }
`;

/// main
export default function WidgetNav() {
    const [showModal, setShowModal] = useRecoilState(showModalState);
    const [showNav, setShowNav] = useRecoilState(showNavState);

    if (showNav) {
        return WidgetNavSpread(showModal, setShowModal, showNav, setShowNav);
    } else {
        return WidgetNavFold(showModal, setShowModal, showNav, setShowNav);
    }
}

/// nav 펼침
export function WidgetNavSpread(showModal, setShowModal, showNav, setShowNav) 
{   
    return (
        <SpreadNavWrapper>
            <div id='widget-nav-header' 
                css={{
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    width: '210px',
                    padding: '10px 10px 0px 16px',
                }}
            >
                <div css={{ fontSize: 20, fontWeight: 700 }}>
                    Widgets
                </div>
                <div css={{display: 'flex', alignItems: 'center'}}>
                    <div 
                        onClick={() => setShowModal(!showModal)} 
                        css={{
                            width: 36, 
                            height: 36, 
                            textAlign: 'center', 
                            borderRadius: '50%',
                            padding: 6, 
                            cursor: 'pointer', 
                            ":hover": {backgroundColor: colors.overlay_grey}, 
                        }}
                    >
                        <img src={plus_green} alt='plus_green' css={{width: 24, height: 24}} />
                    </div>
                    <div 
                        onClick={() => setShowNav(!showNav)}
                        css={{
                            width: 33, 
                            height: 33, 
                            textAlign: 'center', 
                            padding: 6, 
                            borderRadius: '50%',
                            cursor: 'pointer', 
                            ":hover": {backgroundColor: colors.overlay_grey}, 
                            marginLeft: 4
                        }}
                    >
                        <img src={arrow_left} alt='arrow_left' css={{width: 16, height: 16 }} />
                    </div>
                </div>
            </div>
            <div id='nav-widget-list'
                css={{
                    width: '210px',
                    margin: '10px 0px',
                    minHeight: '260px',
                    maxHeight: '420px',
                    overflow: 'scroll',
                }}
            >
                <WidgetListItem>공지사항</WidgetListItem>
                <WidgetListItem>캘린더</WidgetListItem>
                <WidgetListItem>문서 1</WidgetListItem>
                <WidgetListItem>테스트 코드 작성 규칙</WidgetListItem>
                <WidgetListItem>그림 메모</WidgetListItem>
                <WidgetListItem>untitled1</WidgetListItem>
                <WidgetListItem>untitled2</WidgetListItem>
                <WidgetListItem>untitled3</WidgetListItem>
                {/* <WidgetListItem>untitled4</WidgetListItem>
                <WidgetListItem>untitled5</WidgetListItem> */}
            </div>
        </SpreadNavWrapper>
    )
}

/// nav 접음
export function WidgetNavFold(showModal, setShowModal, showNav, setShowNav) {
    return (
        <FoldNavWrapper>
            <div 
                onClick={() => setShowModal(!showModal)} 
                css={{
                    width: 36, 
                    height: 36, 
                    textAlign: 'center', 
                    borderRadius: '50%',
                    padding: 6, 
                    cursor: 'pointer', 
                    ":hover": {backgroundColor: colors.overlay_grey}, 
                }}
            >
                <img src={plus_green} alt='plus_green' css={{width: 24, height: 24}} />
            </div>
            <div 
                onClick={() => setShowNav(!showNav)}
                css={{
                    width: 36, 
                    height: 36, 
                    textAlign: 'center', 
                    padding: 4, 
                    borderRadius: '50%',
                    cursor: 'pointer', 
                    ":hover": {backgroundColor: colors.overlay_grey}, 
                }}
            >
                <img src={arrow_right} alt='arrow_right' css={{width: 28, height: 28 }} />
            </div>
        </FoldNavWrapper>
    )
}