"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/input";
import axios from "axios";
import Modal from "../../utils/modal";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import { useRouter } from "next/navigation";

const PlanManagePage: React.FC = () => {
    const [reload, setReload] = useState(false);
    const [planData, setPlanData] = useState([]);
    const [data, setData] = useState(null);
    const [confirmBody, setConfirmBody] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [oneMode, setOneMode] = useState(false);
    const [error, setError] = useState([]);
    const [confirmMsg, setConfirmMsg] = useState('操作が成功しました。')
    const [active, setActive] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/auth/plan');
                setPlanData(data.data);
            } catch (e) {
                router.push('logout')

            }

        };
        fetchData();
        document.title = 'プラン管理'
    }, [reload]);
    const addPlanForm = (
        <div>
            <div className="text-left pb-[5px] mb-[20px] font-bold	border-b-2	">
                {editMode ? '計画を編集する' : '新しいプランを追加する'}
            </div>
            <div className="flex">
                <div className="w-[35%]">プラン名</div>
                <Input
                    inputClassName="w-[300px]"

                    value={data?.name ?? ""}
                    requirMsg="値を入力してください。" handleChange={(val) => {
                        setData({ ...data, name: val });
                    }} />
            </div>
            <div className="flex">
                <div className="w-[35%]">価格ID</div>
                <Input
                    inputClassName="w-[300px]"
                    value={data?.priceID ?? ""}
                    requirMsg="値を入力してください。" handleChange={(val) => {
                        setData({ ...data, priceID: val });
                    }} />
            </div>
            <div className="flex">
                <div className="w-[35%]">月の募集数</div>
                <Input
                    inputClassName="w-[300px]"

                    value={data?.monthCnt ?? ""}
                    type="number" requirMsg="値を入力してください。" handleChange={(val) => {
                        setData({ ...data, monthCnt: val });
                    }} />
            </div>
            <div className="flex">
                <div className="w-[35%]">同時募集数</div>
                <Input
                    inputClassName="w-[300px]"

                    value={data?.concurrentCnt ?? ''}
                    type="number" requirMsg="値を入力してください。" handleChange={(val) => {
                        setData({ ...data, concurrentCnt: val });
                    }} />
            </div>
            {error.length !== 0 && (
                error.map((aError, idx) =>
                    <div key={idx} className="text-center m-[10px] text-[#EE5736]">{aError}</div>
                )
            )}
        </div>
    )
    const handleSubmit = async () => {
        if (oneMode) {
            setShowConfirm(false);
            return;
        }
        if (!deleteMode) {
            let errorList = [];
            if (!(data?.name?.length > 0))
                errorList.push('プラン名を入力してください。');
            if (!(data?.priceID?.length > 0))
                errorList.push('価格IDを入力してください。');
            if (!(data?.monthCnt?.length > 0 || data?.monthCnt > 0))
                errorList.push('月の募集数を入力してください。');
            if (!(data?.concurrentCnt?.length > 0 || data?.concurrentCnt > 0))
                errorList.push('同時募集数を入力してください。');
            if (errorList.length > 0) {
                setError(errorList);
                return;
            }
        }
        if (editMode) {
            await axios.put('/api/auth/plan', data);
        }
        else if (deleteMode) {
            const result = await axios.delete(`/api/auth/plan?id=${data.id}`);
            if (result.data.type === 'one') {
                setOneMode(true);
                setConfirmMsg('初期計画は削除できません。');
                setShowConfirm(true);
                return;
            }
        } else {
            await axios.post('/api/auth/plan', data);
        }
        setData(null);
        setShowConfirm(false);
        setError([]);
        setReload(!reload);
    }
    const modalBody = () => {
        if (oneMode) {
            return confirmMsg;
        }
        if (deleteMode) {
            return 'このプランを削除してもよろしいですか?';
        }
        if (confirmBody || editMode) {
            return addPlanForm
        }
        return confirmMsg
    }
    return (
        <div className="bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
            <div
                className={
                    showConfirm
                        ? "bg-black bg-opacity-25 w-full min-h-screen fixed left-0 top-0 z-10 overflow-auto duration-500"
                        : "bg-black bg-opacity-25 w-full min-h-screen fixed left-0 top-0 z-10 overflow-auto opacity-0 pointer-events-none duration-500"
                }
            >
                <Modal
                    body={modalBody()}
                    onOk={handleSubmit}
                    onCancel={() => {
                        setShowConfirm(false)
                        setError([]);
                    }}
                />
            </div>
            <div className="flex sp:hidden items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
                <span className="text-title sp:text-sptitle">プラン管理</span>
            </div>
            <div className="p-[30px] sp:pt-[100px]">
                <Button
                    handleClick={() => {
                        setOneMode(false);
                        setDeleteMode(false);
                        setEditMode(false);
                        setData(null);
                        setConfirmBody(true);
                        setShowConfirm(true);
                    }}
                    buttonType={ButtonType.PRIMARY}
                    buttonClassName="mt-[15px] sp:my-[15px] sp:text-small rounded-[0px]"
                >
                    <div className="flex">
                        <img src="/img/plus.svg" alt="plus" className="mr-[5px]" />
                        追加
                    </div>
                </Button>
                {planData.length !== 0 ? (
                    <table className="sp:hidden w-[100%] text-[14px] grow">

                        <thead>
                            <tr>
                                <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                                    プラン名
                                </td>
                                <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                                    価格ID
                                </td>
                                <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                                    月の募集数
                                </td>
                                <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                                    同時募集数
                                </td>
                                <td className="text-center px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                                    編集
                                </td>
                                <td className="text-center px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                                    削除
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {planData?.map((aData, idx) => (
                                <tr key={idx}>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                                        {aData.name}
                                    </td>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                                        {aData.priceID}
                                    </td>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                                        {aData.monthCnt}
                                    </td>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                                        {aData.concurrentCnt}
                                    </td>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                                        <img src="/img/edit.svg" alt="plus" className="m-auto cursor-pointer"
                                            onClick={() => {
                                                setOneMode(false);
                                                setDeleteMode(false);
                                                setData(aData);
                                                setEditMode(true);
                                                setShowConfirm(true);
                                            }}
                                        />
                                    </td>
                                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                                        <img src="/img/delete.png" alt="plus" className="w-[20px] cursor-pointer m-auto"
                                            onClick={() => {
                                                setData(aData);
                                                setOneMode(false);
                                                setEditMode(false);
                                                setDeleteMode(true);
                                                setShowConfirm(true);
                                            }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="sp:hidden text-center pt-[200px] text-title text-[#757575]">
                        表示する資料がありません。
                    </div>
                )}
                <div className="lg:hidden grow">
                    {planData?.map((aData, idx) => (
                        <div
                            key={idx}
                            className=" bg-[#F8F9FA] border border-[#D3D3D3]"
                            onClick={() => setActive(idx)}
                        >
                            <div className="flex justify-between px-[30px] py-[20px] w-full">
                                <div className="flex">
                                    <span className="text-[#3F8DEB]  hover:cursor-pointer sp:text-sp">
                                        {aData.name}
                                    </span>
                                </div>

                                <img
                                    src={idx === active ? "/img/up.svg" : "/img/down.svg "}
                                    className="inline h-[8px]"
                                />
                            </div>
                            {idx === active && (
                                <div className="px-[25px] py-[10px]">
                                    <div className="flex my-[10px]">
                                        <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                                            プラン名
                                        </div>
                                        <span className="mb-[7px] sp:text-spsmall">
                                            {aData.name}
                                        </span>
                                    </div>
                                    <div className="flex my-[10px]">
                                        <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                                            価格ID
                                        </div>
                                        <span className="mb-[7px] sp:text-spsmall">
                                            {aData.priceID}
                                        </span>
                                    </div>
                                    <div className="flex my-[10px]">
                                        <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                                            月の募集数
                                        </div>
                                        <span className="mb-[7px] sp:text-spsmall">
                                            {aData.monthCnt}

                                        </span>
                                    </div>

                                    <div className="flex my-[10px]">
                                        <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                                            同時募集数
                                        </div>
                                        <span className="mb-[7px] sp:text-spsmall">
                                            {aData.concurrentCnt}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <img src="/img/edit.svg" alt="plus" className="cursor-pointer"
                                            onClick={() => {
                                                setOneMode(false);
                                                setDeleteMode(false);
                                                setData(aData);
                                                setEditMode(true);
                                                setShowConfirm(true);
                                            }}
                                        />
                                        <img src="/img/delete.png" alt="plus" className="w-[20px] cursor-pointer"
                                            onClick={() => {
                                                setData(aData);
                                                setOneMode(false);
                                                setEditMode(false);
                                                setDeleteMode(true);
                                                setShowConfirm(true);
                                            }} />
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};
export default PlanManagePage;
