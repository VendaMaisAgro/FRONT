import { getAddresses } from "@/actions/address";
import AddressesClient from "./components/AddressesClient";

export default async function AddressesPage() {
	const addresses = await getAddresses();
	return <AddressesClient addresses={addresses} />;
}
