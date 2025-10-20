import { MaterialIcons } from '@expo/vector-icons';
import { colours } from "@/styles/appStyles";

export default function Radio({ selected, colour }: {
    selected: boolean,
    colour?: string
}) {
    return(
            <MaterialIcons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={30}
                color={colour ?? colours.primary}
            />
    )
}
