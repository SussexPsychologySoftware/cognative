import { MaterialIcons } from '@expo/vector-icons';
import { colours } from "@/styles/appStyles";

export default function Radio({ selected, colour, size }: {
    selected: boolean,
    colour?: string,
    size?: number
}) {
    return(
        <MaterialIcons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={size??30}
            color={colour ?? colours.primary}
        />
    )
}
