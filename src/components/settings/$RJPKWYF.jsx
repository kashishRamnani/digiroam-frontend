import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { retrieveSettings, updateSettings } from '../../features';
import { settingsSchema } from '../../schemas/allSchema';

const ContactList = () => {
    const dispatch = useDispatch();
    const { contactList } = useSelector((state) => state.settings);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedContact, setSelectedContact] = useState({});

    const {
        register, handleSubmit, reset,
    } = useForm({ resolver: zodResolver(settingsSchema) });
    useEffect(() => {
        dispatch(retrieveSettings());
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(updateSettings({ contact: data }));
        setIsEditing(false);
        setIsAddingNew(false);
        reset();
    };


    const handleEdit = (contact) => {
        setIsEditing(true);
        setSelectedContact(contact);
    };

    return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <div className="border p-3 rounded-lg bg-gray-100">
            <input {...register("field")} className="border rounded-md py-2 px-3" />
            <input {...register("label")} className="border rounded-md py-2 px-3" />
            <input {...register("value")} className="border rounded-md py-2 px-3" />
            <input type="checkbox" {...register("isHidden")} className="border rounded-md py-2 px-3" />
        </div>

        <div className="flex space-x-4 mt-4">
            <button type="submit" className="flex-1 py-2 px-4 rounded-md text-white bg-primary hover:bg-[#f67a55]/90">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
            </button>
            {/* <button type="button" onClick={() => setIsAddingNew(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-400">
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
            </button> */}
        </div>
    </form>

    // return (
    //     <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mt-10">
    //         {isAddingNew ? (
    //             <AddNewContactForm register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={onSubmit} />
    //         ) : (
    //             <button
    //                 onClick={() => setIsAddingNew(true)}
    //                 className="mt-4 w-full flex items-center justify-center py-2 mb-4 px-4 rounded-md text-white bg-primary hover:bg-[#f67a55]/90"
    //             >
    //                 <FontAwesomeIcon icon={faPlus} className="mr-2" />
    //                 Add a new
    //             </button>
    //         )}
    //         <h2 className="text-xl font-bold text-gray-800 mb-4">Contact List</h2>
    //         {contactList.length > 0 ? (
    //             contactList.map((contact, index) => (
    //                 <div key={index} className="border-b py-2 flex justify-between items-center">
    //                     <div>
    //                         <p><strong>Field:</strong> {contact.field}</p >
    //                         <p><strong>Label:</strong> {contact.label}</p>
    //                         <p><strong>Value:</strong> {contact.value}</p>
    //                         <p><strong>Hidden:</strong> {contact.isHidden ? "Yes" : "No"}</p>
    //                         <button onClick={() => handleEdit(contact)}>
    //                             <FontAwesomeIcon icon={faEdit} className="mr-2" />
    //                             Edit
    //                         </button>
    //                     </div >
    //                 </div >
    //             ))
    //         ) : (
    //             <p className="text-gray-500">No contacts available</p>
    //         )}
    //         {isEditing && (
    //             <EditContactForm
    //                 register={register}
    //                 errors={errors}
    //                 handleSubmit={handleSubmit}
    //                 onSubmit={onSubmit}
    //                 selectedContact={selectedContact}
    //             />
    //         )}
    //     </div >
    // );
};

// const AddNewContactForm = ({ register, errors, handleSubmit, onSubmit }) => (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
//         <div className="border p-3 rounded-lg bg-gray-100">
//             <input {...register("field")} className="border rounded-md py-2 px-3" />
//             <input {...register("label")} className="border rounded-md py-2 px-3" />
//             <input {...register("value")} className="border rounded-md py-2 px-3" />
//             <input type="checkbox" {...register("isHidden")} className="border rounded-md py-2 px-3" />
//         </div>

//         <div className="flex space-x-4 mt-4">
//             <button type="submit" className="flex-1 py-2 px-4 rounded-md text-white bg-primary hover:bg-[#f67a55]/90">
//                 <FontAwesomeIcon icon={faSave} className="mr-2" />
//                 Save
//             </button>
//             <button type="button" onClick={() => setIsAddingNew(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-400">
//                 <FontAwesomeIcon icon={faTimes} className="mr-2" />
//                 Cancel
//             </button>
//         </div>
//     </form>
// );


// const EditContactForm = ({ register, errors, handleSubmit, onSubmit, selectedContact }) => (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
//         <div className="border p-3 rounded-lg bg-gray-100">
//             <InputField label="Field" name="field" register={register} errors={errors} defaultValue={selectedContact.field} />
//             <InputField label="Label" name="label" register={register} errors={errors} defaultValue={selectedContact.label} />
//             <InputField label="Value" name="value" register={register} errors={errors} defaultValue={selectedContact.value} />
//             <div className="flex items-center mt-2">
//                 <input type="checkbox" {...register("isHidden")} defaultChecked={selectedContact.isHidden} className="mr-2" />
//                 <label>Hidden</label>
//             </div>
//         </div>
//         <div className="flex space-x-4 mt-4">
//             <button type="submit" className="flex-1 py-2 px-4 rounded-md text-white bg-primary hover:bg-[#f67a55]/90">
//                 <FontAwesomeIcon icon={faSave} className="mr-2" />
//                 Save
//             </button>
//             <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-400">
//                 <FontAwesomeIcon icon={faTimes} className="mr-2" />
//                 Cancel
//             </button>
//         </div>
//     </form>
// );

export default ContactList;