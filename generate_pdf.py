from fpdf import FPDF
import markdown

with open("Jharkhand_Water_Contaminants.md", "r", encoding="utf-8") as f:
    md_text = f.read()

# Replace unicode chars that might not be in standard Helvetica or handled well
replacements = {
    '–': '-', '—': '-', '’': "'", '‘': "'", '“': '"', '”': '"', 
    'µ': 'u', '⁺': '+', '⁻': '-', '°': 'deg', '→': '->'
}
for k, v in replacements.items():
    md_text = md_text.replace(k, v)

# Fallback for anything else missing
md_text = md_text.encode('latin-1', 'ignore').decode('latin-1')

html = markdown.markdown(md_text)

class PDF(FPDF):
    pass

pdf = PDF()
pdf.add_page()
pdf.set_font("Helvetica", size=11)
pdf.write_html(html)
pdf.output("Jharkhand_Water_Contaminants.pdf")
