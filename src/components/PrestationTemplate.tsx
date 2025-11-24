import React, { useRef, useState } from 'react';
import { Download, Printer, ArrowLeft, FileText, Paperclip, File, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PrestationTemplateProps {
  prestationData?: any;
  isTemplate?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
  onBack?: () => void;
  onBackgroundClick?: () => void;
  onClose: () => void;
}

const PrestationTemplate: React.FC<PrestationTemplateProps> = ({
  prestationData,
  isTemplate = false,
  onDownload,
  onPrint,
  onBack,
  onBackgroundClick,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Check if this is a "fiche vierge" (empty template)
  const isEmptyTemplate = !prestationData || 
    (!prestationData.client_nom && 
     !prestationData.nom_du_dossier && 
     !prestationData.code_prestation);

  // Format date properly
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (onBackgroundClick && e.target === backgroundRef.current) {
      onBackgroundClick();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadPDF = async () => {
    if (isEmptyTemplate) {
      // Download the static PDF file for fiche vierge
      const link = document.createElement('a');
      link.href = '/DemandedePrestationGeoCasaGroup.pdf';
      link.download = 'Fiche_Vierge_Prestation_GCG.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For filled forms, generate PDF from content
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const fileName = prestationData?.code_prestation
        ? `Prestation_${prestationData.code_prestation}.pdf`
        : 'Prestation_GCG.pdf';

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (onDownload) onDownload();
    }
  };

  const handlePrint = () => {
    if (isEmptyTemplate) {
      // For fiche vierge, open the PDF in new tab for printing
      const pdfUrl = '/DemandedePrestationGeoCasaGroup.pdf';
      window.open(pdfUrl, '_blank');
      return;
    }

    // For filled forms, use browser print
    window.print();
  };

  // Check if documents exist for conditional rendering
  const hasDocuments = prestationData?.documents_physiques || prestationData?.documents_numeriques;
  const hasPhysicalDocuments = prestationData?.documents_physiques && prestationData.documents_physiques.length > 0;
  const hasDigitalDocuments = prestationData?.documents_numeriques && prestationData.documents_numeriques.length > 0;
  
  // Calculate total documents and determine layout
  const totalPhysicalDocs = prestationData?.documents_physiques?.length || 0;
  const totalDigitalDocs = prestationData?.documents_numeriques?.length || 0;
  const totalDocs = totalPhysicalDocs + totalDigitalDocs;

  // Optimized grid layout for A4 format
  const getDocumentGridLayout = () => {
    if (totalDocs <= 4) return 'grid-cols-2';
    if (totalDocs <= 8) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const documentGridCols = getDocumentGridLayout();

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (onBackgroundClick) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [onBackgroundClick]);

  return (
    <div 
      ref={backgroundRef}
      className={`min-h-screen ${onBackgroundClick ? 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4' : 'bg-white'}`}
      style={onBackgroundClick ? { cursor: 'pointer' } : {}}
      onClick={handleBackdropClick}
    >
      {/* Print/Download Actions - Clean Professional Design */}
      {!isTemplate && !onBackgroundClick && (
        <div className="no-print bg-white p-6 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEmptyTemplate ? 'Fiche Vierge de Prestation' : 'Prestation'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isEmptyTemplate ? 'Télécharger' : 'Télécharger'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Content - A4 Format */}
      <div 
        ref={printRef} 
        className={`bg-white print:shadow-none print:mx-auto print-visible mx-auto transition-all duration-300 a4-document ${
          onBackgroundClick 
            ? 'animate-in fade-in-90 zoom-in-90 shadow-2xl rounded-lg overflow-hidden max-h-[95vh] overflow-y-auto cursor-default' 
            : 'shadow-sm'
        }`}
        style={{ 
          width: '210mm', 
          minHeight: onBackgroundClick ? 'auto' : '297mm',
          margin: onBackgroundClick ? '0' : '0 auto',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent background click when clicking on document
      >
        <div className="p-8 h-full flex flex-col" style={{ fontSize: '11px' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-800">
            {/* Left: Company Logo */}
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="GeoCasa Group Logo"
                className="h-14 w-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            {/* Center: Company Info */}
            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">GEOCASA GROUP</h1>
              <div style={{ fontSize: '8px' }} className="text-gray-700 space-y-0.5">
                <div className="font-semibold">Le Cadastre Et L'immobilier Facile</div>
                <div>Carrefour Etoug-Ebe, Yaoundé, Cameroun</div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📞 674-20-92-39 / 696-51-46-52</span>
                </div>
                <div>📧 geocasagroup@gmail.com</div>
              </div>
            </div>

            {/* Right: Code Prestation */}
            {prestationData?.numero && (
              <div className="flex-shrink-0 bg-gray-900 text-white rounded p-2 border-2 border-gray-800">
                <div style={{ fontSize: '8px' }} className="font-bold mb-1">CODE</div>
                <div className="text-sm font-bold font-mono tracking-wide">
                  {prestationData.numero}
                </div>
              </div>
            )}
            {!prestationData?.numero && (
              <div className={`flex-shrink-0 bg-gray-900 text-white rounded p-2 border-2 border-gray-800 ${isEmptyTemplate ? '' : 'no-print'}`}>
                <div style={{ fontSize: '8px' }} className="font-bold mb-1">CODE</div>
                <div className="text-sm font-bold font-mono tracking-wide">
                  {isEmptyTemplate ? 'FICHE VIERGE' : 'À ATTRIBUER'}
                </div>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div className="text-center mb-4">
            <div className="bg-gray-900 text-white rounded p-2 inline-block">
              <h2 className="text-base font-bold tracking-wide">FICHE DE DEMANDE DE PRESTATION</h2>
            </div>
          </div>

          {/* Main Content - Flex container that will grow */}
          <div className="flex-1 space-y-4">
            {/* Section 1: Informations Client */}
            <div>
              <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                <h3 className="font-bold">1. INFORMATIONS CLIENT</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Nom complet du client</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.client_nom || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Type de client</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.client_type || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Email</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.client_email || ''}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Téléphone</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.client_phone || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Adresse complète</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.client_adresse || ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Activité et Procédure */}
            <div>
              <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                <h3 className="font-bold">2. ACTIVITÉ ET PROCÉDURE</h3>
              </div>
              <div className="space-y-2">
                {/* Nom du Dossier and Activité on same line */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Nom Du Dossier</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.nom_du_dossier || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Activité (Département)</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.department_id === 'land-cadastral' && 'Gestion Foncière et Cadastrale'}
                      {prestationData?.department_id === 'financing' && 'Financement Foncier et Immobilier'}
                      {prestationData?.department_id === 'sales-management' && 'Vente et Gestion Immobilière'}
                      {prestationData?.department_id === 'custom' && 'Département Personnalisé'}
                      {!prestationData?.department_id && ''}
                    </div>
                  </div>
                </div>

                {/* Produit and Offre on next line */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Offre choisie</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.procedure_choisie || ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Procédure choisie</div>
                    <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                      {prestationData?.offre_choisie || ''}
                    </div>
                  </div>
                </div>

                {/* Description détaillée avec gestion des lignes vides */}
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Description détaillée</div>
                  <div className="border border-gray-400 rounded p-2 bg-gray-50 min-h-[3rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.description ? (
                      <div className="whitespace-pre-wrap">
                        {prestationData.description.split('\n').map((line: string, index: number) => (
                          <React.Fragment key={index}>
                            {line.trim() === '' ? (
                              <>
                                <br />
                                <br />
                              </>
                            ) : (
                              line
                            )}
                            {index < prestationData.description.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      // Show 2 empty lines when no description
                      <div className="space-y-2">
                        <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                          {prestationData?.description1 || ''}
                        </div>
                        <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                          {prestationData?.description2 || ''}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Localisation */}
            <div>
              <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                <h3 className="font-bold">3. LOCALISATION DU PROJET</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Région</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.region || ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Département</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.departement || ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Ville</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.ville || ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Lieu-dit</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.lieu_dit || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Contact Terrain */}
            <div>
              <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                <h3 className="font-bold">4. CONTACT TERRAIN</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Nom du contact</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.contact_terrain_nom || ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Qualité</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.contact_terrain_qualite || ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1">Téléphone</div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.contact_terrain_phone || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Documents et Pièces - Conditional Rendering */}
            {hasDocuments ? (
              // When documents exist - show compact grid view
              <div>
                <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                  <h3 className="font-bold">5. DOCUMENTS ET PIÈCES FOURNIS EN ANNEXE</h3>
                </div>
                
                {/* Documents Physiques */}
                {hasPhysicalDocuments && (
                  <div className="mb-3">
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Documents Physiques ({totalPhysicalDocs})
                    </div>
                    <div className={`grid ${documentGridCols} gap-1.5`} style={{ fontSize: '8px' }}>
                      {prestationData.documents_physiques.map((doc: string, index: number) => (
                        <div key={index} className="flex items-center space-x-1 bg-white p-1.5 rounded border border-gray-300 min-h-[2rem]">
                          <span className="text-green-600 font-bold text-xs">✓</span>
                          <span className="flex-1 truncate">{doc}</span>
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">Physique</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Documents Numériques */}
                {hasDigitalDocuments && (
                  <div>
                    <div style={{ fontSize: '8px' }} className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      Documents Numériques ({totalDigitalDocs})
                    </div>
                    <div className={`grid ${documentGridCols} gap-1.5`} style={{ fontSize: '8px' }}>
                      {prestationData.documents_numeriques.map((doc: string, index: number) => {
                        const hasFile = prestationData.document_urls && prestationData.document_urls[doc];
                        return (
                          <div key={index} className="flex items-center space-x-1 bg-white p-1.5 rounded border border-blue-200 min-h-[2rem]">
                            <File className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="flex-1 truncate">{doc}</span>
                            <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 whitespace-nowrap">Numérique</span>
                            {hasFile && (
                              <ExternalLink className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // When no documents exist - show simple view
              <div>
                <div className="bg-gray-800 text-white p-1.5 mb-2" style={{ fontSize: '9px' }}>
                  <h3 className="font-bold">5. DOCUMENTS ET PIÈCES FOURNIS</h3>
                </div>
                <div className="space-y-2">
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.document1 || ''}
                  </div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.document2 || ''}
                  </div>
                  <div className="border-b border-gray-400 pb-1 min-h-[1.2rem]" style={{ fontSize: '9px' }}>
                    {prestationData?.document3 || ''}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Signatures */}
          <div className="mt-8 pt-4 border-t-2 border-gray-800">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '10px' }}>SIGNATURE DU CLIENT</h4>
                <div className="border-2 border-gray-400 rounded h-20 flex items-end justify-center pb-1 bg-gray-50">
                  <span style={{ fontSize: '7px' }} className="text-gray-500">Signature et cachet</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '10px' }}>CACHET GEOCASA GROUP</h4>
                <div className="border-2 border-gray-400 rounded h-20 flex items-end justify-center pb-1 bg-gray-50">
                  <span style={{ fontSize: '7px' }} className="text-gray-500">Cachet et signature</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-end">
                <div className="text-right">
                  <p style={{ fontSize: '8px' }} className="text-gray-700">
                    Fait à <span className="border-b border-gray-400 inline-block min-w-[100px] text-center mx-2">Yaoundé</span> le <span className="border-b border-gray-400 inline-block min-w-[100px] text-center mx-2">{formatDate(prestationData?.created_at)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
              padding: 0;
            }

            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              width: 210mm;
              height: 297mm;
            }

            .no-print {
              display: none !important;
            }

            .a4-document,
            .a4-document * {
              visibility: visible !important;
            }

            body * {
              visibility: hidden;
            }

            .a4-document {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              min-height: 297mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              box-shadow: none !important;
              overflow: visible !important;
              page-break-after: avoid;
              page-break-inside: avoid;
            }

            .a4-document > div {
              transform: none;
              transform-origin: top left;
            }

            .print-visible {
              display: block !important;
              visibility: visible !important;
            }

            .a4-document > div {
              break-inside: avoid;
            }
          }

          @media screen {
            .a4-document {
              margin: 0 auto;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              border: 1px solid #e5e7eb;
              height: 297mm;
            }

            .print-visible {
              display: block;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PrestationTemplate;