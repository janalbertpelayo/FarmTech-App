import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

export async function addProduct({ image_url, name, category, status, price, price_unit, quantity, quantity_unit, desc, breed, age, gender, createdAt,user_id }) {
  await addDoc(collection(db, "products"), {
    image_url,
    name,
    category,
    status,
    price,
    price_unit,
    quantity,
    quantity_unit,
    desc,
    breed,
    age,
    gender,
    createdAt,
    user_id,
  });
}

// file: a Blob or File object (from image picker)
export async function uploadProductImage(file, productName) {
  const storageRef = ref(storage, `product_images/${productName}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}