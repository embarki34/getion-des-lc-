import streamlit as st
import fitz  # PyMuPDF
from PIL import Image
import io

st.set_page_config(page_title="PDF First Page Extractor", layout="wide")

st.title("📄 PDF → First Page PNG Extractor")

uploaded_files = st.file_uploader(
    "Upload one or more PDF files",
    type=["pdf"],
    accept_multiple_files=True
)

def extract_first_page_png(pdf_bytes, zoom=2):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc.load_page(0)  # first page

    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    img_bytes = pix.tobytes("png")
    return img_bytes

if uploaded_files:
    st.success(f"{len(uploaded_files)} PDF(s) uploaded")

    cols = st.columns(3)

    for idx, pdf in enumerate(uploaded_files):
        try:
            png_bytes = extract_first_page_png(pdf.read())

            image = Image.open(io.BytesIO(png_bytes))

            with cols[idx % 3]:
                st.image(image, caption=pdf.name, use_container_width=True)

                st.download_button(
                    label="⬇️ Download PNG",
                    data=png_bytes,
                    file_name=f"{pdf.name}_page1.png",
                    mime="image/png"
                )

        except Exception as e:
            st.error(f"Failed to process {pdf.name}: {e}")
 