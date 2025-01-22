import { ModalLayout } from "../../layouts"
import { DropDown, DropDownDataType } from "../DropDown";


interface FilterJobModalProps {
    onClose: () => void;
    skillsData: DropDownDataType[],
    employmentTypesData: DropDownDataType[],
    onSkillDropDownChange: (value: string) => void;
    onEmploymentDropDownChange: (value: string) => void;
    onClickFilter: () => void;
}
export const FilterJobModal: React.FC<FilterJobModalProps> = ({
    onClose,
    skillsData,
    employmentTypesData,
    onSkillDropDownChange,
    onEmploymentDropDownChange,
    onClickFilter,
}) => {
    return (
        <ModalLayout> 
            <div className="m-4">
                <p className="secondary-text text-center"><strong>Filter Job</strong></p>
                    <div className="flex justify-center my-4">
                    <div className="space-y-2">
                            <DropDown 
                                data={skillsData || []} 
                                placeHolder="Skill" 
                                onChange={onSkillDropDownChange}
                            />
                            <DropDown 
                                data={employmentTypesData || []} 
                                placeHolder="Employment Type" 
                                onChange={onEmploymentDropDownChange}
                            />
                    </div>
                    </div>
                <div className="flex justify-center gap-4">
                    <button onClick={onClickFilter} className="primary">Filter</button>
                    <button onClick={onClose} className="secondary">Cancel</button>
                </div>
            </div>
            
        </ModalLayout>
    )
}