import { PATHS } from "@/config/paths";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(PATHS.chat);
}
