import axios from "./axios";

export const verifyInvite = (token) =>

    axios.post(

        "/order/verify",

        {

            token

        }

    );

export const createOrderFromInvite = (

    token,

    option,

    selectedMain

) =>

    axios.post(

        "/order/invite",

        {

            token,

            option,

            selectedMain

        }

    );