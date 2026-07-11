import { WebsiteInfoType } from "@/type";

type Props = {
 label?: string;
 value?: string | number;
};

function LabelCountItems({ label,value }: Props) {
    
    return <div className=" mt-2">
        
              <h2>{label}</h2> 
              <h2 className="text-4xl font-bold">{value ?? 0}</h2>
    </div>
}

export default LabelCountItems;