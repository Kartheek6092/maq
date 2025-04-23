import { BsPersonWorkspace } from "react-icons/bs";
import { HiViewBoards, HiDotsHorizontal } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi2";
import { RiSettings5Fill, RiDeleteBinLine } from "react-icons/ri";
import { RxOpenInNewWindow } from "react-icons/rx";
import { MdOutlineManageAccounts, MdOutlineHub, MdSecurity } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { GrRadialSelected, GrMore, GrResources, GrShieldSecurity } from "react-icons/gr";
import { FaStarOfLife, FaMinus } from "react-icons/fa";
import { TbApi } from "react-icons/tb";
import { GiServerRack } from "react-icons/gi";
import { SiAmazonsimpleemailservice } from "react-icons/si";
import { PiWebhooksLogoFill, PiUsersThreeFill } from "react-icons/pi";
import { AiOutlineDashboard } from "react-icons/ai";
import { LiaQuestionSolid } from "react-icons/lia";
import { FaComputer } from "react-icons/fa6";

type IconName =
    | "BsPersonWorkspace"
    | "HiViewBoards"
    | "HiUserGroup"
    | "RiSettings5Fill"
    | "HiDotsHorizontal"
    | "RxOpenInNewWindow"
    | "MdOutlineManageAccounts"
    | "RiDeleteBinLine"
    | "IoMdAdd"
    | "GrRadialSelected"
    | "GrMore"
    | "FaStarOfLife"
    | "FaMinus"
    | "TbApi"
    | "MdOutlineHub"
    | "MdSecurity"
    | "GrResources"
    | "GiServerRack"
    | "SiAmazonsimpleemailservice"
    | "GrShieldSecurity"
    | "AiOutlineDashboard"
    | "LiaQuestionSolid"
    | "PiUsersThreeFill"
    | "FaComputer"
    | "PiWebhooksLogoFill";

export default function renderIcons(
    icon: IconName,
    size: number = 20,
    color: string = "#000"
): JSX.Element | undefined {
    switch (icon) {
        case "BsPersonWorkspace":
            return <BsPersonWorkspace size={size} style={{ color }} />;
        case "HiViewBoards":
            return <HiViewBoards size={size} style={{ color }} />;
        case "HiUserGroup":
            return <HiUserGroup size={size} style={{ color }} />;
        case "RiSettings5Fill":
            return <RiSettings5Fill size={size} style={{ color }} />;
        case "HiDotsHorizontal":
            return <HiDotsHorizontal size={size} style={{ color }} />;
        case "RxOpenInNewWindow":
            return <RxOpenInNewWindow size={size} style={{ color }} />;
        case "MdOutlineManageAccounts":
            return <MdOutlineManageAccounts size={size} style={{ color }} />;
        case "RiDeleteBinLine":
            return <RiDeleteBinLine size={size} style={{ color }} />;
        case "IoMdAdd":
            return <IoMdAdd size={size} style={{ color }} />;
        case "GrRadialSelected":
            return <GrRadialSelected size={size} style={{ color }} />;
        case "GrMore":
            return <GrMore size={size} style={{ color }} />;
        case "FaStarOfLife":
            return <FaStarOfLife size={size} style={{ color }} />;
        case "FaMinus":
            return <FaMinus size={size} style={{ color }} />;
        case "TbApi":
            return <TbApi size={size} style={{ color }} />;
        case "MdOutlineHub":
            return <MdOutlineHub size={size} style={{ color }} />;
        case "MdSecurity":
            return <MdSecurity size={size} style={{ color }} />;
        case "GrResources":
            return <GrResources size={size} style={{ color }} />;
        case "GiServerRack":
            return <GiServerRack size={size} style={{ color }} />;
        case "SiAmazonsimpleemailservice":
            return <SiAmazonsimpleemailservice size={size} style={{ color }} />;
        case "GrShieldSecurity":
            return <GrShieldSecurity size={size} style={{ color }} />;
        case "PiWebhooksLogoFill":
            return <PiWebhooksLogoFill size={size} style={{ color }} />;
        case "AiOutlineDashboard":
            return <AiOutlineDashboard size={size} style={{ color }} />;
        case "LiaQuestionSolid":
            return <LiaQuestionSolid size={size} style={{ color }} />;
        case "PiUsersThreeFill":
            return <PiUsersThreeFill size={size} style={{ color }} />;
        case "FaComputer":
            return <FaComputer size={size} style={{ color }} />;
        default:
            return undefined;
    }
}