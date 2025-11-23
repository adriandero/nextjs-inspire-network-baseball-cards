
import { getProfileByUuid } from "@/src/lib/data/profiles";
import { PDFProfileFullContent } from "@/src/features/profile-pdf/pdf-profile-full-content";

type tParams = Promise<{ uuid: string }>;

export default async function TugCardPDF({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { uuid } = await params;
  const profile = await getProfileByUuid(uuid);

  return <PDFProfileFullContent profile={profile} />;
}
