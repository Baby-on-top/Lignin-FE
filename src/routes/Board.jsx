/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { atom, useRecoilState } from "recoil";
import WidgetAddModal from "../components/board/WidgetAddModal";

// import YorkieTldrawEditor from "../components/widgets/tldraw/YorkieTldrawEditor";
// import Note from "../components/widgets/note/Note";
// import Note2 from "../components/widgets/note/Note2";

export const showModalState = atom({
    key: 'showModalState',  
    default: false,      
});                              

export default function Board() {
    const navigate = useNavigate();
    const [cookie] = useCookies(['cookie']);
    const [showModal, setShowModal] = useRecoilState(showModalState);
    
    // 페이지에 들어올때 쿠키로 사용자 체크
    const loginCheck = () => {
        const token = cookie.accessToken;
        if(!token) { // 토큰이 없다면 로그인 화면으로 라우팅
            navigate('/login');
        }
    }
    useEffect(() => {
        const fetch = async () => {
            await loginCheck();
        }
        fetch();
    });

    return (
        <>
            {/* <YorkieTldrawEditor /> */}
            {/* <Note /> */}
            {/* <Note2 /> */}
            <div css={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div css={{marginBottom: 20}}> Board </div>
                <button css={{width: '5%'}} onClick={() => setShowModal(!showModal)}> + </button>

                <WidgetAddModal />
            </div>
        </>
    )
}
