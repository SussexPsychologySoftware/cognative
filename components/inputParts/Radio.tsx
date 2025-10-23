import { MaterialIcons } from '@expo/vector-icons';
import { colours } from "@/styles/appStyles";
import {DimensionValue} from "react-native";

export default function Radio({ selected, colour, size }: {
    selected: boolean,
    colour?: string,
    size?: DimensionValue
}) {
    return(
            <MaterialIcons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={size??30}
                color={colour ?? colours.primary}
            />
    )
}
