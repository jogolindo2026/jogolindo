import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Camera, Save, Target, Mail, Phone, Ruler } from 'lucide-react'; // Removidos os ícones não usados
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { user: currentUser, updateProfile } = useAuthStore(); // Mantido apenas o necessário
  const navigate = useNavigate();
  
  const isOwnProfile = !id || id === currentUser?.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    country: '',
    city: '',
    position: '',
    company: '',
    isProfilePublic: true,
    profilePicture: '',
    height: '',
    weight: '',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (!currentUser && isOwnProfile) {
      navigate('/login');
    }
  }, [currentUser, navigate, isOwnProfile]);

  useEffect(() => {
    if (currentUser && isOwnProfile) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || '',
        birthDate: currentUser.birthDate || '',
        country: currentUser.country || '',
        city: currentUser.city || '',
        position: currentUser.position || '',
        company: currentUser.company || '',
        isProfilePublic: currentUser.isProfilePublic ?? true,
        profilePicture: currentUser.profilePicture || '',
        height: currentUser.height?.toString() || '',
        weight: currentUser.weight?.toString() || '',
      });
    }
  }, [currentUser, isOwnProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!isOwnProfile) return;
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwnProfile) return;
    
    // Preparando os dados para o Supabase
    const updateData: any = { 
      name: formData.name,
      phone: formData.phone,
      position: formData.position,
      birthDate: formData.birthDate,
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseInt(formData.weight) : null
    };
    
    if (previewImage) updateData.profilePicture = previewImage;

    await updateProfile(updateData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={previewImage || formData.profilePicture || `https://ui-avatars.com/api/?name=${formData.name}&background=0A5F38&color=fff`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                    alt="Foto"
                  />
                  {isEditing && isOwnProfile && (
                    <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                      <Camera size={18} />
                      <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPreviewImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold">{formData.name}</h2>
                <p className="text-green-700 font-semibold mb-4 uppercase">
                  {currentUser?.role || 'Usuário'}
                </p>

                <div className="text-sm text-gray-500 space-y-2 border-t pt-4">
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={14} /> {formData.email}
                  </div>
                  {isOwnProfile && formData.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={14} /> {formData.phone}
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'primary'} className="mt-6 w-full">
                    {isEditing ? 'Cancelar' : 'Editar Perfil'}
                  </Button>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-bold">{isEditing ? 'Editando Informações' : 'Informações do Atleta'}</h3>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                      <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 outline-none disabled:bg-transparent" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Posição</label>
                      <select name="position" value={formData.position} onChange={handleChange} disabled={!isEditing} className="w-full border-b py-2 outline-none bg-transparent">
                        <option value="">Selecione</option>
                        <option value="goalkeeper">Goleiro</option>
                        <option value="defender">Zagueiro</option>
                        <option value="midfielder">Meio-Campo</option>
                        <option value="forward">Atacante</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Altura (cm)</label>
                      <div className="flex items-center border-b">
                        <Ruler size={14} className="text-gray-400 mr-2" />
                        <input type="number" name="height" value={formData.height} onChange={handleChange} disabled={!isEditing} className="w-full py-2 outline-none bg-transparent" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Foco/Alvo</label>
                      <div className="flex items-center border-b">
                        <Target size={14} className="text-gray-400 mr-2" />
                        <input name="target" value="Profissionalização" disabled className="w-full py-2 outline-none bg-transparent opacity-50" />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button type="submit" variant="primary" leftIcon={<Save size={18} />}>
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;