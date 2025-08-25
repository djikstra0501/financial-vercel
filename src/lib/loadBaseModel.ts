export async function loadBaseModel(): Promise<string> {
  const res = await fetch("/baseModel.txt");
  if (!res.ok) throw new Error("Failed to load base model");
  return res.text();
}
