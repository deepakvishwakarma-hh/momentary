
import jwt from "jsonwebtoken"
import Image from "next/image"
import { motion } from 'framer-motion'
import { Flex, Box, Grid, useToast } from "@chakra-ui/react"
import Loader from "../../../component/loaders/spinner";
import Chat from "../../../component/chat-component/chat";
import { useEffect, useLayoutEffect, useState } from "react";
import Footer from "../../../component/chat-component/footer";
import Header from "../../../component/chat-component/header";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import Share from "../../../component/chat-component/popups/share";
import Setting from "../../../component/chat-component/popups/setting";
import { updateUser, updateRoomInfo } from "../../store/features/slices"
import { addMyMessage, getRoomData, removeMyMessages } from "../../../code-blocks/chat.realtime";
import Validator from "../../../component/validation-system/validate-user-login"
import useWindowDimensions from "../../../code-blocks/useDimention"


export default function Room({ query }) {

    const toast = useToast();
    const dispatch = useAppDispatch();

    // state related blocks
    const user = useAppSelector(state => state.user);
    const [roomData, setRoomData] = useState<any>(false);
    const oldChat = useAppSelector(state => state.room.chat);
    const [myNewMessage, setMyNewMessage] = useState<string>('');

    // Handlers 
    const onChangeHandler = e => { setMyNewMessage(e.target.value) }
    const addMessageToRoom = () => {
        const { displayName, email, photoURL } = user;
        (myNewMessage !== '') ? addMyMessage(query, oldChat, { displayName, email, photoURL }, myNewMessage) : null;
        setMyNewMessage('')
    }
    const removeMyMessagesHandler = () => {
        removeMyMessages(query as string, oldChat, user.email, () => {
            toast({
                title: 'Messages deleted',
                description: "We've deleted your messages for you.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        })
    }

    // component effects 

    // decode and update user
    useLayoutEffect(() => {
        const decryptedToken = jwt.decode(localStorage.getItem('token'))
        dispatch(updateUser(decryptedToken) as any)
    }, [])

    // update room data
    useEffect(() => {
        getRoomData(query, (data) => {
            dispatch(updateRoomInfo(data) as any)
            setRoomData(data)
        })
    }, [query]);

    return (
        <Validator>
            <Loader target={!roomData} />

            <Flex position={"fixed"} width={"100%"}
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                alignItems={['start', "center"]}
                justifyContent="center" height={"100%"} >
                <Setting id={query} removeMyMessages={removeMyMessagesHandler} />
                <Grid
                    overflow={"hidden"}
                    templateRows={'60px auto 100px'}
                    w={1200}
                    h={['100%', 800]}
                    bg={"black"}
                    borderRadius={['0', 10]}>
                    <Header
                        query={query} />
                    <Chat
                        userEmail={user?.email} />
                    <Footer
                        myNewMessage={myNewMessage}
                        onChangeHandler={onChangeHandler} addMessageToRoom={addMessageToRoom} />
                </Grid>
            </Flex>
        </Validator >
    )
}

export async function getServerSideProps(context) {
    const { query, res } = context;
    return ({ props: { query: query.id } })
}
