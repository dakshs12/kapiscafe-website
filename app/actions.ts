"use server";

export async function submitCustomCakeOrder(formData: FormData) {
  const order = {
    name: formData.get("fullName") || formData.get("name"),
    phone: formData.get("phone"),
    date: formData.get("eventDate") || formData.get("date"),
    occasion: formData.get("occasion"),
    tier: formData.get("tier"),
    weight: formData.get("weight"),
    flavour: formData.get("flavour"),
    topper: formData.get("topperText") || formData.get("topper"),
    notes: formData.get("designNotes") || formData.get("notes"),
    createdAt: new Date().toISOString(),
  };
  console.log("🎂 Custom Cake Order Received:", order);
  return { success: true };
}
