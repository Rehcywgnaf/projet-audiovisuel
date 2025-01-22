import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TemplateManager, DocumentManager } from '../components'

// 1. Tests TemplateManager
describe('TemplateManager', () => {
  // Tests du catalogue
  describe('TemplateCatalog', () => {
    test('charge correctement la liste des templates', async () => {
      const { container } = render(<TemplateCatalog />)
      expect(await screen.findByTestId('template-list')).toBeInTheDocument()
      // Vérifier le nombre initial de templates
      expect(container.querySelectorAll('.template-item')).toHaveLength(3)
    })

    test('filtre correctement les templates par type', async () => {
      render(<TemplateCatalog />)
      fireEvent.click(screen.getByText('AAP'))
      // Vérifier que seuls les templates AAP sont affichés
      expect(screen.getAllByTestId('template-item-aap')).toHaveLength(2)
    })
  })

  // Tests du StructureManager
  describe('StructureManager', () => {
    test('valide correctement la structure des templates', () => {
      const template = {
        type: 'AAP',
        sections: ['introduction', 'budget', 'planning'],
        required: ['budget']
      }
      expect(validateTemplateStructure(template)).toBeTruthy()
    })
  })
})

// 2. Tests DocumentManager
describe('DocumentManager', () => {
  // Tests du VersionManager
  describe('VersionManager', () => {
    test('crée correctement une nouvelle version', async () => {
      const doc = { id: '1', content: 'Test content' }
      const version = await createVersion(doc)
      expect(version.id).toBeDefined()
      expect(version.previousVersion).toBeNull()
    })

    test('gère correctement l\'historique des versions', async () => {
      const doc = { id: '1', content: 'Initial' }
      const v1 = await createVersion(doc)
      doc.content = 'Updated'
      const v2 = await createVersion(doc)
      expect(v2.previousVersion).toBe(v1.id)
    })
  })

  // Tests ImportExport
  describe('ImportExport', () => {
    test('exporte correctement au format PDF', async () => {
      const doc = { id: '1', content: 'Test export' }
      const pdf = await exportToPDF(doc)
      expect(pdf).toBeDefined()
      expect(pdf.type).toBe('application/pdf')
    })
  })
})

// 3. Tests d'intégration
describe('Integration Tests', () => {
  test('TemplateManager crée correctement un document dans DocumentManager', async () => {
    const template = await loadTemplate('aap-standard')
    const doc = await createDocumentFromTemplate(template)
    expect(doc.template).toBe(template.id)
    expect(doc.structure).toEqual(template.structure)
  })
})